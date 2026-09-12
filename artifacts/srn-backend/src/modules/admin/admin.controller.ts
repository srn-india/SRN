import { Request, Response } from 'express';
import * as adminService from './admin.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendError } from '../../utils/response';

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const result = await adminService.getAllUsers(page, limit);
  sendSuccess(res, result, 'Users fetched successfully');
});

export const banUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isBanned } = req.body;
  const user = await adminService.toggleUserBan(id as string, isBanned);
  sendSuccess(res, user, `User has been ${isBanned ? 'banned' : 'unbanned'}`);
});

export const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const analytics = await adminService.getAnalytics();
  sendSuccess(res, analytics, 'Analytics fetched successfully');
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await adminService.deleteUser(req.params.id as string);
  sendSuccess(res, null, 'User deleted successfully');
});

export const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { role } = req.body;
  const user = await adminService.updateUserRole(req.params.id as string, role);
  sendSuccess(res, user, 'User role updated successfully');
});

export const updateUserName = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
    return sendError(res, 'First name is required', 400);
  }
  const user = await adminService.updateUserName(id as string, firstName, lastName);
  sendSuccess(res, user, 'User name updated successfully');
});
