import { Request, Response } from 'express';
import * as userService from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendError } from '../../utils/response';
import { uploadToSupabase } from '../../utils/upload';
import { prisma } from '../../lib/prisma';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    sendSuccess(res, user, 'Profile fetched successfully');
  } catch (error: any) {
    sendError(res, error.message, null, 404);
  }
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const data = { ...req.body };
  if (req.file) {
    // Upload to 'avatars' bucket
    const publicUrl = await uploadToSupabase(req.file, 'avatars');
    data.avatar = publicUrl;
  }
  
  const updatedUser = await userService.updateUserProfile(req.user.id, data);
  sendSuccess(res, updatedUser, 'Profile updated successfully');
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.changePassword(req.user.id, req.body);
  sendSuccess(res, result, 'Password changed successfully');
});

export const getMembership = catchAsync(async (req: Request, res: Response) => {
  const membership = await prisma.membership.findFirst({
    where: { userId: req.user.id, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, membership, 'Membership status fetched');
});
