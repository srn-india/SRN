import { prisma } from '../../lib/prisma';
import * as membershipService from '../membership/membership.service';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PaymentType } from '@prisma/client';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createOrder = async (userId: string, amount: number, type: PaymentType) => {
  const orderOptions = {
    amount: amount * 100, // amount in the smallest currency unit (paise)
    currency: "INR",
  };
  
  const razorpayOrder = await razorpay.orders.create(orderOptions);
  
  return await prisma.payment.create({
    data: {
      userId,
      amount,
      type,
      status: 'PENDING',
      provider: 'RAZORPAY',
      razorpayOrderId: razorpayOrder.id,
    },
  });
};

export const verifyPayment = async (paymentData: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, purpose?: string }, userId: string) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purpose } = paymentData;
  
  const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: razorpay_order_id } });
  if (!payment || payment.userId !== userId) {
    throw new Error('Payment record not found');
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
    .update(body.toString())
    .digest('hex');
    
  if (expectedSignature !== razorpay_signature) {
    throw new Error('Invalid payment signature');
  }
  
  return await prisma.$transaction(async (tx: any) => {
    // 1. Update payment status and store payment ID
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: { 
        status: 'SUCCESS',
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    // 2. Decouple logic depending on type
    if (payment.type === 'MEMBERSHIP') {
      await membershipService.subscribeUser(userId, 'PREMIUM', 12, tx);
    } else if (payment.type === 'DONATION') {
      const userObj = await tx.user.findUnique({ where: { id: userId } });
      await tx.donation.create({
        data: {
          paymentId: payment.id,
          purpose: purpose || null,
          donorName: userObj ? `${userObj.firstName || ''} ${userObj.lastName || ''}`.trim() : null,
          donorEmail: userObj?.email || null,
        }
      });
    }

    return updatedPayment;
  });
};
