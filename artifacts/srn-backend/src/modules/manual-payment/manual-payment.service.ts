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
    email?: string;
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
  const recipientEmail = data.email || user.email;

  sendEmail(
    ADMIN_EMAIL,
    `🔔 New Manual Payment Submitted — ₹${data.amount} (${data.type})`,
    `<h2>Manual Payment ${initialStatus === 'APPROVED' ? 'Received (Auto-Approved)' : 'Pending Verification'}</h2>
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

  // If DONATION, send the thank you email immediately in the background
  if (data.type === 'DONATION') {
    (async () => {
      let attachments: any[] = [];
      try {
        const pdfBuffer = await generateReceiptPdf({
          userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Contributor',
          userPan: (user as any).govIdNumber || (user as any).panNumber || undefined,
          userPhone: user.phone || undefined,
          userEmail: user.email || undefined,
          amount: Number(data.amount),
          paymentId: data.utrNumber,
          type: 'DONATION',
          date: new Date(),
          method: data.purpose?.includes('[BANK TRANSFER]') ? 'Bank Transfer' : 'UPI (Manual)'
        });
        attachments.push({
          filename: 'SRN_Donation_Receipt.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        });
      } catch (err) {
        console.error('Failed to generate PDF receipt:', err);
      }

      if (recipientEmail) {
        await sendEmail(
          recipientEmail,
          '✅ Your Donation has been received!',
          `<h2>Dear ${user.firstName},</h2>
           <p>We have successfully received your generous donation of <b>₹${data.amount}</b> via ${data.purpose?.includes('[BANK TRANSFER]') ? 'Bank Transfer' : 'UPI'}.</p>
           <p>Your contribution directly empowers our youth-driven initiatives and helps us build a stronger India. We cannot do this without the support of dedicated individuals like you.</p>
           <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 24px 0;">
             <h3 style="margin-top:0; color: #111;">Donation Receipt</h3>
             <p style="margin:4px 0;"><b>Amount:</b> ₹${data.amount}</p>
             <p style="margin:4px 0;"><b>Payment Method:</b> ${data.purpose?.includes('[BANK TRANSFER]') ? 'Bank Transfer' : 'UPI'}</p>
             <p style="margin:4px 0;"><b>UTR / Transaction ID:</b> ${data.utrNumber}</p>
             <p style="margin:4px 0;"><b>Date:</b> ${new Date().toLocaleDateString('en-IN')}</p>
           </div>
           <p>Please find the official PDF receipt attached to this email.</p>
           <p>With deep gratitude,<br><b>The SRN Team</b></p>
           <center><a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Visit Dashboard</a></center>`,
          undefined,
          attachments
        ).then(() => console.log('Donation thank you email sent successfully')).catch(err => console.error('Donation thank you email failed:', err));
      }
    })();
  }
  
  // Send an acknowledgment email for ALL manual payments immediately if email is available
  if (recipientEmail) {
    console.log('Sending acknowledgment email to', recipientEmail);
    sendEmail(
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
    const membership = await membershipService.subscribeUser(payment.userId, 'PREMIUM', 36);
    membershipId = membership.id;
  }

  const updated = await prisma.manualPayment.update({
    where: { id },
    data: { status: 'APPROVED', adminNote, membershipId },
  });

  // Notify user with ID card and receipt (unified email)
  const user = payment.user;
  const firstName = user.firstName || 'Member';

  if (payment.type === 'MEMBERSHIP') {
    try {
      await sendIdCard(payment.userId);
    } catch (err) {
      console.error('Failed to send ID card and receipt on approval:', err);
    }
  } else {
    // DONATION: Generate receipt PDF and send confirmation email
    let attachments: any[] = [];
    try {
      const pdfBuffer = await generateReceiptPdf({
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || firstName,
        userPan: (user as any).govIdNumber || (user as any).panNumber || undefined,
        userPhone: user.phone || undefined,
        userEmail: user.email || undefined,
        amount: Number(payment.amount),
        paymentId: payment.utrNumber,
        type: 'DONATION',
        date: payment.createdAt,
        method: payment.purpose?.includes('[BANK TRANSFER]') ? 'Bank Transfer' : 'UPI (Manual)'
      });
      attachments.push({
        filename: 'SRN_Donation_Receipt.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    } catch (err) {
      console.error('Failed to generate donation receipt PDF on approval:', err);
    }

    if (user.email) {
      try {
        await sendEmail(
          user.email,
          '✅ Your Donation has been verified!',
          `<h2>Thank you for your generous donation, ${firstName}!</h2>
           <p>Your donation of <b>₹${payment.amount}</b> via ${payment.purpose?.includes('[BANK TRANSFER]') ? 'Bank Transfer' : 'UPI'} has been successfully verified.</p>
           <p>Your official tax-deductible receipt is attached to this email.</p>
           ${adminNote ? `<p><b>Note:</b> ${adminNote}</p>` : ''}
           <center><a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Visit Dashboard</a></center>`,
          'Your donation is verified',
          attachments
        );
      } catch (err) {
        console.error('Donation approval email dispatch failed:', err);
      }
    }
  }

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

  // Notify user if email exists
  const user = payment.user;
  if (user?.email) {
    try {
      await sendEmail(
        user.email,
        'Issue with your SRN Payment',
        `<h2>Hi ${user.firstName},</h2>
         <p>We encountered an issue while verifying your recent payment of <b>₹${payment.amount}</b>.</p>
         <p><b>Reason:</b> ${adminNote}</p>
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

