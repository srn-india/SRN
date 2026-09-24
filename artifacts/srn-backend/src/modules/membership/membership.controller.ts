import { Request, Response } from 'express';
import * as membershipService from './membership.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendError } from '../../utils/response';
import { prisma } from '../../lib/prisma';
import { supabase } from '../../lib/supabase';
import { generateAndUploadIdCard } from './idcard.service';
import { sendRashtraMitraWelcomeEmail } from '../../utils/email.service';
import { sendIdCard } from '../manual-payment/manual-payment.service';
import { generateReceiptPdf } from '../../utils/receipt.service';

export const getMyMembership = catchAsync(async (req: Request, res: Response) => {
  const membership = await membershipService.getMembership(req.user.id);
  sendSuccess(res, membership, 'Membership details fetched successfully');
});

export const registerNormal = catchAsync(async (req: Request, res: Response) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    gender, 
    dateOfBirth, 
    govIdType, 
    govIdNumber, 
    panNumber,
    state, 
    district, 
    profession,
    profilePicture 
  } = req.body;

  let userId = req.user?.id;

  const cleanPhone = phone ? String(phone).trim() : null;
  const idNum = govIdNumber ? String(govIdNumber).trim() : (panNumber ? String(panNumber).trim() : null);
  const pan = (govIdType === 'PAN' ? (govIdNumber ? String(govIdNumber).trim() : null) : (panNumber ? String(panNumber).trim() : null));

  const cleanEmail = email ? email.toLowerCase().trim() : null;

  if (!userId) {
    if (!cleanPhone && !cleanEmail) {
      return sendError(res, 'Phone number is required to register membership', null, 400);
    }
    let user = cleanEmail 
      ? await prisma.user.findUnique({ where: { email: cleanEmail } }) 
      : (cleanPhone ? await prisma.user.findFirst({ where: { phone: cleanPhone } }) : null);

    // Validate email uniqueness
    if (cleanEmail) {
      const existingEmailUser = await prisma.user.findFirst({
        where: {
          email: cleanEmail,
          ...(user ? { id: { not: user.id } } : {})
        }
      });
      if (existingEmailUser) {
        return sendError(res, 'This email address is already registered with another account/member.', null, 400);
      }
    }

    // Validate phone uniqueness
    if (cleanPhone) {
      const existingPhoneUser = await prisma.user.findFirst({
        where: {
          phone: cleanPhone,
          ...(user ? { id: { not: user.id } } : {})
        }
      });
      if (existingPhoneUser) {
        return sendError(res, 'This phone number is already registered with another account/member.', null, 400);
      }
    }

    // Validate government ID uniqueness
    if (idNum) {
      const existingGovUser = await prisma.user.findFirst({
        where: {
          govIdNumber: idNum,
          ...(user ? { id: { not: user.id } } : {})
        }
      });
      if (existingGovUser) {
        return sendError(res, 'This Government ID number is already registered with another member.', null, 400);
      }
    }

    // Validate PAN uniqueness
    if (pan) {
      const existingPanUser = await prisma.user.findFirst({
        where: {
          panNumber: pan,
          ...(user ? { id: { not: user.id } } : {})
        }
      });
      if (existingPanUser) {
        return sendError(res, 'This PAN card number is already registered with another member.', null, 400);
      }
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName: firstName || 'Member',
          lastName: lastName || '',
          email: cleanEmail,
          phone: cleanPhone,
          gender: gender || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          govIdType: govIdType || null,
          govIdNumber: idNum,
          panNumber: pan,
          state: state || null,
          district: district || null,
          avatar: profilePicture || null,
          isVerified: true,
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          phone: cleanPhone || user.phone,
          gender: gender || user.gender,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth,
          govIdType: govIdType || user.govIdType,
          govIdNumber: idNum || user.govIdNumber,
          panNumber: pan || user.panNumber,
          state: state || user.state,
          district: district || user.district,
          avatar: profilePicture || user.avatar,
        }
      });
    }
    userId = user.id;
  } else {
    // Validate phone uniqueness for logged in user
    if (cleanPhone) {
      const existingPhoneUser = await prisma.user.findFirst({
        where: {
          phone: cleanPhone,
          id: { not: userId }
        }
      });
      if (existingPhoneUser) {
        return sendError(res, 'This phone number is already registered with another account/member.', null, 400);
      }
    }

    // Validate government ID uniqueness
    if (idNum) {
      const existingGovUser = await prisma.user.findFirst({
        where: {
          govIdNumber: idNum,
          id: { not: userId }
        }
      });
      if (existingGovUser) {
        return sendError(res, 'This Government ID number is already registered with another member.', null, 400);
      }
    }

    // Validate PAN uniqueness
    if (pan) {
      const existingPanUser = await prisma.user.findFirst({
        where: {
          panNumber: pan,
          id: { not: userId }
        }
      });
      if (existingPanUser) {
        return sendError(res, 'This PAN card number is already registered with another member.', null, 400);
      }
    }

    if (cleanEmail) {
      const existingEmailUser = await prisma.user.findFirst({
        where: {
          email: cleanEmail,
          id: { not: userId }
        }
      });
      if (existingEmailUser) {
        return sendError(res, 'This email address is already registered with another account/member.', null, 400);
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email: cleanEmail || undefined,
        phone: cleanPhone || undefined,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        govIdType: govIdType || undefined,
        govIdNumber: idNum,
        panNumber: pan,
        state: state || undefined,
        district: district || undefined,
        avatar: profilePicture || undefined,
      },
    }).catch(console.error);
  }

  const membership = await membershipService.registerNormalMembership(userId);

  // Send Rashtra Mitra welcome email
  const userObj = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true } }).catch(() => null);
  if (userObj?.email) {
    sendRashtraMitraWelcomeEmail(userObj.email, userObj.firstName || undefined).catch((err) => {
      console.error('Failed to send Rashtra Mitra welcome email:', err);
    });
  }

  sendSuccess(res, membership, 'Normal membership activated successfully');
});


export const cancelMyMembership = catchAsync(async (req: Request, res: Response) => {
  const result = await membershipService.cancelMembership(req.params.id as string, req.user.id);
  sendSuccess(res, result, 'Membership cancelled successfully');
});

export const getAllMemberships = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await membershipService.getAllMemberships(page, limit);
  sendSuccess(res, result, 'All memberships fetched successfully');
});

export const exportMembershipsExcel = catchAsync(async (req: Request, res: Response) => {
  const buffer = await membershipService.exportMembershipsToExcel();
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `SRN_Memberships_Register_${dateStr}.xlsx`;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', buffer.length);
  res.send(buffer);
});

export const generateIdCard = catchAsync(async (req: Request, res: Response) => {
  const membership = await prisma.membership.findFirst({
    where: { userId: req.user.id, status: 'ACTIVE' },
    include: { user: true }
  });

  if (!membership) {
    return sendError(res, 'No active membership found', null, 404);
  }

  // Pre-calculate URL with download option to force download instead of preview
  const { data: publicUrlData } = supabase.storage
    .from('id-cards')
    .getPublicUrl(`${membership.id}.png`, {
      download: `ID_${membership.user.firstName}_${membership.user.lastName}.png`
    });
    
  const publicUrl = publicUrlData.publicUrl;

  // Ideally, we'd check if the file exists, but for simplicity we'll just attempt to fetch headers
  // or just redirect and let the client handle it.
  // As a fallback, we can try to generate it here if it doesn't exist.
  try {
    const headRes = await fetch(publicUrl, { method: 'HEAD' });
    if (!headRes.ok) {
      // It doesn't exist, trigger generation synchronously as a fallback
      await generateAndUploadIdCard(membership.id);
    }
  } catch (err) {
    // ignore
  }

  res.redirect(publicUrl);
});

export const sendMembershipOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, tier, name } = req.body;
  if (!email) {
    return sendError(res, 'Email address is required', null, 400);
  }

  const result = await membershipService.sendMembershipOtp({
    email,
    tier: tier === 'active' ? 'active' : 'normal',
    name: name || (req.user ? `${req.user.firstName} ${req.user.lastName}` : undefined),
  });

  sendSuccess(res, result, result.message);
});

export const verifyMembershipOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, tier } = req.body;
  if (!email || !otp) {
    return sendError(res, 'Email and 6-digit OTP code are required', null, 400);
  }

  const result = await membershipService.verifyMembershipOtp({
    email,
    otp,
    tier,
  });

  sendSuccess(res, result, result.message);
});

export const resendIdCard = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await sendIdCard(id as string);
  sendSuccess(res, result, 'Member ID card sent successfully');
});

export const downloadReceipt = catchAsync(async (req: Request, res: Response) => {
  const membership = await prisma.membership.findFirst({
    where: { userId: req.user.id, status: 'ACTIVE' },
    include: { user: true }
  });

  if (!membership) {
    return sendError(res, 'No active membership found', null, 404);
  }

  // Look for the payment record to get accurate transaction details
  const payment = await prisma.payment.findFirst({
    where: { userId: req.user.id, type: 'MEMBERSHIP', status: 'SUCCESS' },
    orderBy: { createdAt: 'desc' }
  });

  const manualPayment = !payment ? await prisma.manualPayment.findFirst({
    where: { userId: req.user.id, type: 'MEMBERSHIP', status: 'APPROVED' },
    orderBy: { createdAt: 'desc' }
  }) : null;

  const pdfBuffer = await generateReceiptPdf({
    userName: `${membership.user.firstName || ''} ${membership.user.lastName || ''}`.trim() || 'Valued Member',
    userPan: (membership.user as any).govIdNumber || (membership.user as any).panNumber || undefined,
    userPhone: membership.user.phone || undefined,
    userEmail: membership.user.email || undefined,
    amount: payment ? Number(payment.amount) : (manualPayment ? Number(manualPayment.amount) : 2500),
    paymentId: payment?.razorpayPaymentId || manualPayment?.utrNumber || membership.id,
    type: 'MEMBERSHIP',
    date: payment?.createdAt || manualPayment?.createdAt || membership.createdAt,
    method: payment ? 'RAZORPAY' : (manualPayment?.purpose?.includes('[BANK TRANSFER]') ? 'Bank Transfer' : 'UPI (Manual)')
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="SRN_Membership_Receipt_${membership.user.firstName || 'Member'}.pdf"`);
  res.send(pdfBuffer);
});

export const deleteMembership = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await membershipService.deleteMembershipById(id);
  sendSuccess(res, result, 'Membership record deleted successfully');
});

