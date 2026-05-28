import { prisma } from '../../lib/prisma';
import * as membershipService from '../membership/membership.service';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createOrder = async (userId: string, amount: number) => {
  const orderOptions = {
    amount: amount * 100, // amount in the smallest currency unit (paise)
    currency: "INR",
  };
  
  const razorpayOrder = await razorpay.orders.create(orderOptions);
  
  return await prisma.payment.create({
    data: {
      userId,
      amount,
      status: 'PENDING',
      provider: 'RAZORPAY',
      transactionId: razorpayOrder.id,
    },
  });
};

export const verifyPayment = async (paymentData: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }, userId: string) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
  
  const payment = await prisma.payment.findUnique({ where: { transactionId: razorpay_order_id } });
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
    // 1. Update payment status
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCESS' },
    });

    // 2. Activate membership (e.g. 1 year for 999 INR)
    // Simple logic: if amount >= 999 then 12 months, else 1 month
    const duration = payment.amount >= 999 ? 12 : 1;
    await membershipService.subscribeUser(userId, 'PREMIUM', duration, tx);

    return updatedPayment;
  });
};
