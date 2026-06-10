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
