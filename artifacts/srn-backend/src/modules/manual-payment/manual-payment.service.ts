import { prisma } from '../../lib/prisma';
import { PaymentType } from '@prisma/client';
import { generateReceiptPdf, ReceiptData } from '../../utils/receipt.service';
import * as membershipService from '../membership/membership.service';
import * as idcardService from '../membership/idcard.service';
import { sendEmail } from '../../utils/email.service';

const ADMIN_EMAIL = process.env.PAYMENT_NOTIFICATION_EMAIL || 'srnindia.admin@gmail.com';

// ── User: Submit a manual QR payment ────────────────────────────────────────
export const submitPayment = async (
  userId: string,
  data: {
    amount: number;
    type: 'MEMBERSHIP' | 'DONATION';
    utrNumber: string;
    screenshot?: string;
    purpose?: string;
  }
) => {
  // Donations are automatically approved since they don't grant member privileges
  const initialStatus = data.type === 'DONATION' ? 'APPROVED' : 'PENDING';

  const payment = await prisma.manualPayment.create({
    data: {
      userId,
      amount: data.amount,
      type: data.type as PaymentType,
      utrNumber: data.utrNumber,
      screenshot: data.screenshot,
      purpose: data.purpose,
      status: initialStatus as any, // Bypass TS check if needed, but 'APPROVED' is valid
    },
    include: { user: true },
  });

  // Notify admin in background
  const user = payment.user;
  const userName = `${user.firstName} ${user.lastName}`.trim();
  sendEmail(
    ADMIN_EMAIL,
    `🔔 New Manual Payment Submitted — ₹${data.amount} (${data.type})`,
    `<h2>Manual Payment ${initialStatus === 'APPROVED' ? 'Received (Auto-Approved)' : 'Pending Verification'}</h2>
     <ul>
       <li><b>User:</b> ${userName} (${user.email})</li>
       <li><b>Type:</b> ${data.type}</li>
       <li><b>Amount:</b> ₹${data.amount}</li>
       <li><b>UTR / Transaction ID:</b> ${data.utrNumber}</li>
       ${data.screenshot ? `<li><b>Screenshot:</b> <a href="${data.screenshot}">View</a></li>` : ''}
       ${data.purpose ? `<li><b>Purpose:</b> ${data.purpose}</li>` : ''}
     </ul>
     <p><a href="${process.env.FRONTEND_URL}/admin-dashboard" class="btn">Review in Admin Dashboard</a></p>`
  ).catch(err => console.error('Admin notification email failed:', err));

  // If DONATION, send the thank you email immediately in the background
  if (data.type === 'DONATION') {
    (async () => {
      let attachments: any[] = [];
      try {
        const pdfBuffer = await generateReceiptPdf({
          userName: `${user.firstName} ${user.lastName}`.trim(),
          amount: Number(data.amount),
          paymentId: data.utrNumber,
          type: 'DONATION',
          date: new Date(),
          method: 'UPI (Manual)'
        });
        attachments.push({
          filename: 'SRN_Donation_Receipt.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        });
      } catch (err) {
        console.error('Failed to generate PDF receipt:', err);
      }

      await sendEmail(
        user.email,
        '✅ Your Donation has been received!',
        `<h2>Dear ${user.firstName},</h2>
         <p>We have successfully received your generous donation of <b>₹${data.amount}</b> via UPI.</p>
         <p>Your contribution directly empowers our youth-driven initiatives and helps us build a stronger India. We cannot do this without the support of dedicated individuals like you.</p>
         <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 24px 0;">
           <h3 style="margin-top:0; color: #111;">Donation Receipt</h3>
           <p style="margin:4px 0;"><b>Amount:</b> ₹${data.amount}</p>
           <p style="margin:4px 0;"><b>Payment Method:</b> UPI</p>
           <p style="margin:4px 0;"><b>UTR / Transaction ID:</b> ${data.utrNumber}</p>
           <p style="margin:4px 0;"><b>Date:</b> ${new Date().toLocaleDateString('en-IN')}</p>
         </div>
         <p>Please find the official PDF receipt attached to this email.</p>
         <p>With deep gratitude,<br><b>The SRN Team</b></p>
         <center><a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Visit Dashboard</a></center>`,
        undefined,
        attachments
      ).catch(err => console.error('Donation thank you email failed:', err));
    })();
  }

  return payment;
};

// ── User: Get own manual payments ───────────────────────────────────────────
export const getMyPayments = async (userId: string) => {
  return prisma.manualPayment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

// ── Admin: Get all payments by status ───────────────────────────────────────
export const getAllPayments = async (status?: string) => {
  return prisma.manualPayment.findMany({
    where: status ? { status: status as any } : undefined,
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

// ── Admin: Approve a payment ─────────────────────────────────────────────────
export const approvePayment = async (id: string, adminNote?: string) => {
  const payment = await prisma.manualPayment.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!payment) throw new Error('Payment not found');
  if (payment.status !== 'PENDING') throw new Error('Payment is not pending');

  let membershipId: string | undefined;

  // Grant membership if applicable
  if (payment.type === 'MEMBERSHIP') {
    const membership = await membershipService.subscribeUser(payment.userId, 'PREMIUM', 12);
    membershipId = membership.id;
  }

  const updated = await prisma.manualPayment.update({
    where: { id },
    data: { status: 'APPROVED', adminNote, membershipId },
  });

  // Notify user in background
  const user = payment.user;
  const firstName = user.firstName;
  sendEmail(
    user.email,
    payment.type === 'MEMBERSHIP'
      ? '🎉 Your SRN Membership is now Active!'
      : '✅ Your Donation has been verified!',
    payment.type === 'MEMBERSHIP'
      ? `<h2>Welcome to SRN, ${firstName}!</h2>
         <p>Your payment of <b>₹${payment.amount}</b> via UPI has been verified by our team.</p>
         <p>Your SRN Membership is now <b>ACTIVE</b>. You can log in to access all member features.</p>
         ${adminNote ? `<p><b>Note from admin:</b> ${adminNote}</p>` : ''}
         <center><a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Go to Dashboard</a></center>`
      : `<h2>Thank you for your generous donation, ${firstName}!</h2>
         <p>Your donation of <b>₹${payment.amount}</b> via UPI has been successfully verified.</p>
         ${adminNote ? `<p><b>Note:</b> ${adminNote}</p>` : ''}
         <center><a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Visit Dashboard</a></center>`
  ).catch(err => console.error('Approval email failed:', err));

  return { ...updated, membershipId };
};

// ── Admin: Reject a payment ──────────────────────────────────────────────────
export const rejectPayment = async (id: string, adminNote: string) => {
  const payment = await prisma.manualPayment.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!payment) throw new Error('Payment not found');
  if (payment.status !== 'PENDING') throw new Error('Payment is not pending');

  const updated = await prisma.manualPayment.update({
    where: { id },
    data: { status: 'REJECTED', adminNote },
  });

  // Notify user in background
  const user = payment.user;
  sendEmail(
    user.email,
    '❌ Issue with your SRN Payment',
    `<h2>Hi ${user.firstName},</h2>
     <p>We encountered an issue while verifying your recent payment of <b>₹${payment.amount}</b>.</p>
     <p><b>Reason:</b> ${adminNote}</p>
     <p>If you believe this is an error, please reply to this email or re-submit your payment verification via the website.</p>
     <center><a href="${process.env.FRONTEND_URL}/donate" class="btn">Re-submit Payment</a></center>`
  ).catch(err => console.error('Rejection email failed:', err));

  return updated;
};

// ── Admin: Send ID card email to a user ──────────────────────────────────────
export const sendIdCard = async (userId: string) => {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  });
  if (!membership) throw new Error('No active membership found for this user');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  // Generate / re-upload ID card to Supabase and get URL
  const cardUrl = await idcardService.generateAndUploadIdCard(membership.id);
  if (!cardUrl) throw new Error('Failed to generate ID card');

  // Try to find the associated manual payment for the receipt
  const payment = await prisma.manualPayment.findFirst({
    where: { userId, type: 'MEMBERSHIP', status: 'APPROVED' },
    orderBy: { createdAt: 'desc' }
  });

  const firstName = user.firstName;
  let attachments: any[] = [];

  if (payment) {
    try {
      const pdfBuffer = await generateReceiptPdf({
        userName: `${user.firstName} ${user.lastName}`.trim(),
        amount: Number(payment.amount),
        paymentId: payment.utrNumber,
        type: 'MEMBERSHIP',
        date: payment.createdAt,
        method: 'UPI (Manual)'
      });
      attachments.push({
        filename: 'SRN_Membership_Receipt.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    } catch (err) {
      console.error('Failed to generate membership receipt PDF:', err);
    }
  }

  // Use the backgrounded approach for sendEmail as well!
  sendEmail(
    user.email,
    '🪪 Your SRN Member ID Card & Receipt',
    `<h2>Your SRN ID Card is Ready, ${firstName}!</h2>
     <p>Welcome to Sashakt Rashtra Nirman. Your active member ID card has been generated.</p>
     <p>Click the button below to view and download your official SRN Member ID Card.</p>
     ${attachments.length > 0 ? '<p>Please find the official receipt for your membership payment attached to this email.</p>' : ''}
     <center><a href="${cardUrl}" class="btn">Download ID Card</a></center>`,
     undefined,
     attachments
  ).catch(err => console.error('Failed to send ID card email:', err));

  return { success: true, membershipId: membership.id, cardUrl };
};
