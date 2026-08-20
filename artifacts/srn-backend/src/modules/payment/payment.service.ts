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

async function notifyUserOfPayment(payment: any) {
  if (!payment.userEmail) return;

  const isDonation = payment.type === 'DONATION';
  const firstName = payment.userName ? payment.userName.split(' ')[0] : 'Supporter';
  
  const subject = isDonation 
    ? 'Thank you for your generous donation to SRN!' 
    : 'Welcome to Sashakt Rashtra Nirman! Your membership is active.';

  const htmlContent = isDonation
    ? `
      <h2>Dear ${firstName},</h2>
      <p>We have successfully received your generous donation of <b>₹${payment.amount}</b>.</p>
      <p>Your contribution directly empowers our youth-driven initiatives and helps us build a stronger India. We cannot do this without the support of dedicated individuals like you.</p>
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <h3 style="margin-top:0; color: #111;">Donation Receipt</h3>
        <p style="margin:4px 0;"><b>Amount:</b> ₹${payment.amount}</p>
        <p style="margin:4px 0;"><b>Transaction ID:</b> ${payment.razorpayPaymentId}</p>
        <p style="margin:4px 0;"><b>Date:</b> ${new Date(payment.createdAt).toLocaleDateString('en-IN')}</p>
      </div>
      <p>A formal tax-deductible receipt (if applicable) will be generated and available on your dashboard soon.</p>
      <p>With deep gratitude,<br><b>The SRN Team</b></p>
      <center><a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Go to Dashboard</a></center>
    `
    : `
      <h2>Welcome to the SRN Family, ${firstName}!</h2>
      <p>Your <b>SRN Membership</b> is now officially active (Payment of ₹${payment.amount} successfully received).</p>
      <p>By becoming a member, you are taking a powerful step toward nation-building. Your voice, your skills, and your passion are exactly what we need to drive real change. We are incredibly excited to work alongside you to empower our youth and strengthen our communities!</p>
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <h3 style="margin-top:0; color: #111;">Membership Receipt</h3>
        <p style="margin:4px 0;"><b>Amount Paid:</b> ₹${payment.amount}</p>
        <p style="margin:4px 0;"><b>Transaction ID:</b> ${payment.razorpayPaymentId}</p>
        <p style="margin:4px 0;"><b>Status:</b> ACTIVE</p>
      </div>
      <p>As a core member, you now have exclusive access to our community forums, volunteer drives, and leadership events.</p>
      <p><b>Next Step:</b> Your official SRN ID Card is ready! Click the button below to download it.</p>
      <center>
        <a href="${
          payment.membershipId 
            ? `${process.env.SUPABASE_URL}/storage/v1/object/public/id-cards/${payment.membershipId}.png?download=ID_${firstName}.png` 
            : `${process.env.FRONTEND_URL}/dashboard`
        }" class="btn">Download ID Card</a>
      </center>
      <p style="margin-top: 24px;">Let's build a stronger India, together.<br><b>The SRN Team</b></p>
    `;

  try {
    await sendEmail(payment.userEmail, subject, htmlContent, 'Thank you for your support!');
  } catch (err) {
    console.error('Failed to send user thank you email:', err);
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

    let membershipId: string | undefined = undefined;

    // 2. Decouple logic depending on type
    if (payment.type === 'MEMBERSHIP') {
      const membership = await membershipService.subscribeUser(userId, 'PREMIUM', 12, tx);
      membershipId = membership.id;
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

    return { ...updatedPayment, membershipId };
  });

  // 3. Notify Admin (after transaction commits to avoid rolling back on email failure)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  const paymentDetails = {
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
    membershipId: result.membershipId,
  };

  // 3. Notify Admin (run in background, do NOT await so API returns instantly)
  notifyAdminOfPayment(paymentDetails).catch(console.error);
  
  if (user?.email) {
    notifyUserOfPayment(paymentDetails).catch(console.error);
  }

  // 4. Artificial delay to allow the loading UI to display and background tasks to boot
  await new Promise(resolve => setTimeout(resolve, 2000));

  return result;
};
