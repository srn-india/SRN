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
  const { state, district, profession } = req.body;

  if (state || district) {
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        state: state || undefined,
        district: district || undefined,
      },
    }).catch(console.error);
  }

  const membership = await membershipService.registerNormalMembership(req.user.id);
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
