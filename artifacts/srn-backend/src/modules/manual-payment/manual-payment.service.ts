import { prisma } from '../../lib/prisma';
import { PaymentType } from '@prisma/client';
import { z } from 'zod';
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
    email?: string;
  }
) => {
  const initialStatus = 'PENDING';

  const payment = await prisma.manualPayment.create({
    data: {
      userId,
      amount: data.amount,
      type: data.type as PaymentType,
      utrNumber: data.utrNumber,
      screenshot: data.screenshot,
      purpose: data.purpose,
      status: initialStatus
    },
    include: { user: true },
  });

  // Await notifications so the hosting platform can finish delivery before responding.
  const user = payment.user;
  const userName = `${user.firstName} ${user.lastName}`.trim();
  const recipientEmail = data.email || user.email;

  await sendEmail(
    ADMIN_EMAIL,
    `🔔 New Manual Payment Submitted — ₹${data.amount} (${data.type})`,
    `<h2>Manual Payment Pending Verification</h2>
     <ul>
       <li><b>User:</b> ${userName} (${recipientEmail})</li>
       <li><b>Type:</b> ${data.type}</li>
       <li><b>Amount:</b> ₹${data.amount}</li>
       <li><b>UTR / Transaction ID:</b> ${data.utrNumber}</li>
       ${data.screenshot ? `<li><b>Screenshot:</b> <a href="${data.screenshot}">View</a></li>` : ''}
       ${data.purpose ? `<li><b>Purpose:</b> ${data.purpose}</li>` : ''}
     </ul>
     <p><a href="${process.env.FRONTEND_URL}/admin-dashboard" class="btn">Review in Admin Dashboard</a></p>`
  ).catch(err => console.error('Admin notification email failed:', err));

  // Send an acknowledgment email for ALL manual payments immediately if email is available
  if (recipientEmail) {
    console.log('Sending acknowledgment email to', recipientEmail);
    await sendEmail(
      recipientEmail,
      'Payment Verification Pending',
      `<h2>Hi ${user.firstName},</h2>
        <p>We have received your manual payment submission of <b>₹${data.amount}</b> for ${data.type}.</p>
        <p>Our team will verify your transaction (<b>${data.utrNumber}</b>) shortly.</p>
        <p>You will receive a confirmation email and your receipt once it is approved.</p>`
    ).then(() => console.log('Ack email sent successfully')).catch(err => console.error('Ack email failed:', err));
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
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          state: true,
          district: true,
          gender: true,
          dateOfBirth: true,
          panNumber: true,
          govIdType: true,
          govIdNumber: true,
          role: true,
          isVerified: true,
          createdAt: true,
          memberships: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              plan: true,
              status: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));

const correctionSchema = z.object({
  amount: z.number().positive().max(99999999.99).refine(value => Math.abs(value * 100 - Math.round(value * 100)) < 0.00001, 'Use at most two decimal places').optional(),
  utrNumber: z.string().trim().min(1).max(100).optional(),
  purpose: z.string().trim().max(4000).optional(),
}).strict();

// Both online and manual donations use this review queue. Online payment facts remain immutable.
export const sendDonationReceipt = async (id: string) => {
  const payment = await prisma.manualPayment.findUnique({ where: { id }, include: { user: true } });
  if (!payment || payment.type !== 'DONATION' || payment.status !== 'APPROVED') throw new Error('Donation must be approved before sending a receipt');
  const user = payment.user;
  if (!user.email) throw new Error('Donor email is required to send a receipt');
  const method = payment.id.startsWith('razorpay:') ? 'RAZORPAY' : payment.purpose?.includes('[BANK TRANSFER]') ? 'Bank Transfer' : 'UPI (Manual)';
  const pdfBuffer = await generateReceiptPdf({
    userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Supporter',
    userPan: user.panNumber || (user.govIdType === 'PAN' ? user.govIdNumber : undefined) || undefined,
    userPhone: user.phone || undefined,
    userEmail: user.email,
    amount: payment.amount,
    paymentId: payment.utrNumber,
    type: 'DONATION',
    date: payment.createdAt,
    method,
  });
  await sendEmail(user.email, 'Your SRN donation has been approved',
    `<h2>Thank you, ${escapeHtml(user.firstName || 'Supporter')}!</h2>
     <p>Your donation has been reviewed and approved by our admin team.</p>
     <p><b>Verified amount:</b> ₹${payment.amount}<br><b>Transaction ID:</b> ${escapeHtml(payment.utrNumber)}<br><b>Method:</b> ${method}</p>
     <p><b>Donation details:</b> ${escapeHtml(payment.purpose || '')}</p>
     ${payment.adminNote ? `<p><b>Admin review and corrections:</b></p><pre style="white-space:pre-wrap">${escapeHtml(payment.adminNote)}</pre>` : ''}
     <p>Your approved donation receipt is attached.</p>`,
    'Your donation has been approved. Please see the attached receipt.',
    [{ filename: 'SRN_Donation_Receipt.pdf', content: pdfBuffer, contentType: 'application/pdf' }]);
};

// ── Admin: Approve a payment ─────────────────────────────────────────────────
export const approvePayment = async (id: string, adminNote?: string, input: unknown = {}) => {
  const corrections = correctionSchema.parse(input);
  const note = z.string().trim().max(4000).parse(adminNote ?? '');
  const payment = await prisma.manualPayment.findUnique({ where: { id }, include: { user: true } });
  if (!payment) throw new Error('Payment not found');
  if (payment.status !== 'PENDING') throw new Error('Payment is not pending');
  const changes = Object.entries(corrections).filter(([key, value]) => value !== (payment[key as keyof typeof payment] ?? ''));
  if (changes.length && payment.type !== 'DONATION') throw new Error('Corrections are only supported for donations');
  if (changes.length && !note) throw new Error('An admin note explaining the corrections is required');
  if (payment.id.startsWith('razorpay:') && changes.some(([key]) => key === 'amount' || key === 'utrNumber')) throw new Error('Online payment amount and transaction ID cannot be changed');
  const reviewNote = [note, ...changes.map(([key, value]) => `${key}: ${payment[key as keyof typeof payment] ?? '(empty)'} → ${value}`)].filter(Boolean).join('\n');
  let membershipId: string | undefined;
  if (payment.type === 'MEMBERSHIP') {
    const membership = await membershipService.subscribeUser(payment.userId, 'PREMIUM', 36);
    membershipId = membership.id;
  }
  // Conditional update prevents concurrent approvals from issuing duplicate receipts.
  const updated = await prisma.manualPayment.update({
    where: { id, status: 'PENDING' },
    data: { ...corrections, status: 'APPROVED', adminNote: reviewNote, membershipId },
  });
  let emailSent = false;
  let deliveryError: string | undefined;
  try {
    if (payment.type === 'MEMBERSHIP') await sendIdCard(payment.userId);
    else await sendDonationReceipt(id);
    emailSent = true;
  } catch (err) {
    console.error('Approval email dispatch failed:', err);
    deliveryError = 'Payment approved, but receipt email failed. Please retry sending it.';
  }
  return { ...updated, membershipId, emailSent, deliveryError };
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
    where: { id, status: 'PENDING' },
    data: { status: 'REJECTED', adminNote: z.string().trim().min(1).max(4000).parse(adminNote) },
  });

  // Notify user if email exists
  const user = payment.user;
  if (user?.email) {
    try {
      await sendEmail(
        user.email,
        'Issue with your SRN Payment',
        `<h2>Hi ${user.firstName},</h2>
         <p>We encountered an issue while verifying your recent payment of <b>₹${payment.amount}</b>.</p>
         <p><b>Reason:</b> ${escapeHtml(adminNote)}</p>
         <p>If you believe this is an error, please reply to this email or re-submit your payment verification via the website.</p>
         <center><a href="${process.env.FRONTEND_URL}/donate" class="btn">Re-submit Payment</a></center>`
      );
    } catch (err) {
      console.error('Rejection email dispatch failed:', err);
    }
  }

  return updated;
};

// ── Admin: Send ID card email to a user (repeatable) ──────────────────────────
export const sendIdCard = async (identifier: string) => {
  // 1. Locate membership by membership ID or by userId
  let membership = await prisma.membership.findFirst({
    where: {
      OR: [
        { id: identifier },
        { userId: identifier }
      ],
      status: 'ACTIVE'
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!membership) {
    membership = await prisma.membership.findFirst({
      where: {
        OR: [
          { id: identifier },
          { userId: identifier }
        ]
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  if (!membership) throw new Error('No active membership record found for this user');

  const user = await prisma.user.findUnique({ where: { id: membership.userId } });
  if (!user || !user.email) throw new Error('User or valid recipient email address not found');

  // 2. Generate / refresh ID card in Supabase storage and get permanent URL
  const cardUrl = await idcardService.generateAndUploadIdCard(membership.id);
  if (!cardUrl) throw new Error('Failed to generate official ID card');

  // 3. Locate associated payment for receipt attachment (Manual Payment or Razorpay)
  let paymentInfo: { amount: number; paymentId: string; date: Date; method: 'RAZORPAY' | 'Bank Transfer' | 'UPI (Manual)' } | null = null;

  const manualPay = await prisma.manualPayment.findFirst({
    where: { userId: user.id, type: 'MEMBERSHIP', status: 'APPROVED' },
    orderBy: { createdAt: 'desc' }
  });

  if (manualPay) {
    paymentInfo = {
      amount: Number(manualPay.amount),
      paymentId: manualPay.utrNumber,
      date: manualPay.createdAt,
      method: manualPay.purpose?.includes('[BANK TRANSFER]') ? 'Bank Transfer' : 'UPI (Manual)'
    };
  } else {
    const razorpayPay = await prisma.payment.findFirst({
      where: { userId: user.id, type: 'MEMBERSHIP', status: 'SUCCESS' },
      orderBy: { createdAt: 'desc' }
    });
    if (razorpayPay) {
      paymentInfo = {
        amount: Number(razorpayPay.amount),
        paymentId: razorpayPay.razorpayPaymentId || razorpayPay.id,
        date: razorpayPay.createdAt,
        method: 'RAZORPAY'
      };
    }
  }

  const firstName = user.firstName || 'Member';
  let attachments: any[] = [];

  // 4. Attach the official ID card PNG directly
  try {
    const cardRes = await fetch(cardUrl);
    if (cardRes.ok) {
      attachments.push({
        filename: `SRN_ID_Card_${firstName}.png`,
        content: Buffer.from(await cardRes.arrayBuffer()),
        contentType: 'image/png'
      });
    }
  } catch (err) {
    console.error('Failed to attach ID card image:', err);
  }

  // 5. Attach official receipt PDF if payment record exists
  if (paymentInfo) {
    try {
      const pdfBuffer = await generateReceiptPdf({
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || firstName,
        userPan: (user as any).govIdNumber || (user as any).panNumber || undefined,
        userPhone: user.phone || undefined,
        userEmail: user.email,
        amount: paymentInfo.amount,
        paymentId: paymentInfo.paymentId,
        type: 'MEMBERSHIP',
        date: paymentInfo.date,
        method: paymentInfo.method
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

  // 6. Dispatch email via Resend API (HTTPS) with attachments
  await sendEmail(
    user.email,
    '🪪 Your SRN Member ID Card & Receipt',
    `<h2>Your SRN ID Card is Ready, ${firstName}!</h2>
     <p>Welcome to Sashakt Rashtra Nirman. Your official member ID card is attached below.</p>
     <p>You can also download your ID card anytime using the secure link below:</p>
     <div style="margin: 20px 0; text-align: center;">
       <a href="${cardUrl}" class="btn" style="background-color: #E8622A; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Download ID Card</a>
     </div>
     ${paymentInfo ? '<p>Your payment receipt is also attached to this email.</p>' : ''}
     <p>Thank you for contributing to nation-building with SRN!</p>`,
    'Your official SRN Member ID Card is ready',
    attachments
  );

  return { success: true, membershipId: membership.id, cardUrl, sentTo: user.email };
};

// ── Admin: Delete a single manual payment record ────────────────────────────
export const deletePayment = async (id: string) => {
  const payment = await prisma.manualPayment.findUnique({ where: { id } });
  if (!payment) throw new Error('Payment record not found');
  await prisma.manualPayment.delete({ where: { id } });
  return { success: true, id };
};

// ── Admin: Bulk cleanup approved / rejected / old manual payment records ────
export const cleanupPayments = async (filter: { status?: string; olderThanDays?: number }) => {
  const whereClause: any = {};
  if (filter.status && filter.status !== 'ALL') {
    whereClause.status = filter.status;
  } else {
    // Default to approved records or processed records
    whereClause.status = { in: ['APPROVED', 'REJECTED'] };
  }

  if (filter.olderThanDays && filter.olderThanDays > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - filter.olderThanDays);
    whereClause.createdAt = { lte: cutoff };
  }

  const result = await prisma.manualPayment.deleteMany({
    where: whereClause,
  });

  return { success: true, count: result.count };
};

