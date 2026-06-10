import { Request, Response } from 'express';
import * as userService from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendError } from '../../utils/response';
import { uploadToSupabase } from '../../utils/upload';
import { prisma } from '../../lib/prisma';
import { supabase } from '../../lib/supabase';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    const responseUser = { ...user, profilePicture: user.avatar };
    delete (responseUser as any).avatar;
    
    sendSuccess(res, responseUser, 'Profile fetched successfully');
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
  } else if (data.profilePicture && data.profilePicture.startsWith('data:image')) {
    const matches = data.profilePicture.match(/^data:(image\/\w+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      const fileExt = mimeType.split('/')[1] || 'jpg';
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: false,
        });
        
      if (!error) {
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        data.avatar = publicUrlData.publicUrl;
      }
    }
  } else if (data.profilePicture && !data.profilePicture.startsWith('data:image')) {
    // If it's already a URL
    data.avatar = data.profilePicture;
  }
  
  const updatedUser = await userService.updateUserProfile(req.user.id, data);
  const responseUser = { ...updatedUser, profilePicture: updatedUser.avatar };
  delete (responseUser as any).avatar;
  
  sendSuccess(res, responseUser, 'Profile updated successfully');
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
