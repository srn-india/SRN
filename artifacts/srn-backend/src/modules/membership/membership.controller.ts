import { Request, Response } from 'express';
import * as membershipService from './membership.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendError } from '../../utils/response';
import { prisma } from '../../lib/prisma';
import { supabase } from '../../lib/supabase';
import { generateAndUploadIdCard } from './idcard.service';

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

  if (!userId) {
    if (!email) {
      return sendError(res, 'Email is required to register membership', null, 400);
    }
    const cleanEmail = email.toLowerCase().trim();
    let user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    const idNum = govIdNumber || panNumber || null;
    const pan = (govIdType === 'PAN' ? govIdNumber : panNumber) || null;

    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName: firstName || 'Member',
          lastName: lastName || '',
          email: cleanEmail,
          phone: phone || null,
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
          phone: phone || user.phone,
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
    const idNum = govIdNumber || panNumber || undefined;
    const pan = (govIdType === 'PAN' ? govIdNumber : panNumber) || undefined;

    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
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
