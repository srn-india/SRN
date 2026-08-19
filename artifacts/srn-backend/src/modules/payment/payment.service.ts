import { prisma } from '../../lib/prisma';
import * as membershipService from '../membership/membership.service';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PaymentType } from '@prisma/client';
import * as XLSX from 'xlsx';
import { sendEmail } from '../../utils/email.service';
import { uploadPaymentReport } from '../../utils/storage.service';
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

async function notifyAdminOfPayment(payment: {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  planName?: string;
  createdAt: Date;
}) {
  // Fetch all successful payments from the database for the complete ledger
  const allPayments = await prisma.payment.findMany({
    include: {
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const rows = allPayments.map(p => ({
    'Payment ID': p.id,
    'Razorpay Order ID': p.razorpayOrderId || '',
    'Razorpay Payment ID': p.razorpayPaymentId || '',
    'User Name': p.user ? `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() : p.userId,
    'User Email': p.user?.email || '',
    'Amount': p.amount,
    'Currency': 'INR',
    'Type': p.type,
    'Status': p.status,
    'Date': p.createdAt.toISOString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  const filename = `Payment_Details_${payment.id}.xlsx`;
  const recipient = process.env.PAYMENT_NOTIFICATION_EMAIL || 'srnindia.admin@gmail.com';

  try {
    const reportUrl = await uploadPaymentReport(filename, buffer);

    await sendEmail(
      recipient,
      `New Payment Received — ₹${payment.amount} (${payment.type})`,
      `
        <p>A new ${payment.type} payment has been recorded.</p>
        <ul>
          <li><b>Amount:</b> ₹${payment.amount}</li>
          <li><b>Status:</b> ${payment.status}</li>
          <li><b>User:</b> ${payment.userName ?? payment.userId}</li>
          <li><b>Date:</b> ${payment.createdAt.toLocaleString()}</li>
        </ul>
        <p><a href="${reportUrl}">Download full payment details (Excel)</a></p>
        <p style="color:#888;font-size:12px;">This link expires in 30 days.</p>
      `
    );
  } catch (err) {
    console.error('Failed to send payment notification email:', err);
  }
}

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
  
  const result = await prisma.$transaction(async (tx: any) => {
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

  // 3. Notify Admin (after transaction commits to avoid rolling back on email failure)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  await notifyAdminOfPayment({
    id: result.id,
    userId: result.userId,
    userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : undefined,
    userEmail: user?.email,
    amount: result.amount,
    currency: 'INR',
    type: result.type,
    status: result.status,
    razorpayOrderId: result.razorpayOrderId || razorpay_order_id,
    razorpayPaymentId: result.razorpayPaymentId || razorpay_payment_id,
    createdAt: result.createdAt,
  });

  return result;
};
