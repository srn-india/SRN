import { Request, Response } from 'express';
import * as forumService from './forum.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';

import { uploadToSupabase } from '../../utils/upload';

export const createThread = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    const imageUrl = await uploadToSupabase(req.file, 'complaints', 'forums');
    req.body.imageUrl = imageUrl;
  }
  const thread = await forumService.createThread(req.body, req.user.id);
  sendSuccess(res, thread, 'Thread created successfully', 201);
});

export const getThreads = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await forumService.getThreads(page, limit);
  sendSuccess(res, result, 'Threads fetched successfully');
});

export const getThreadById = catchAsync(async (req: Request, res: Response) => {
  const thread = await forumService.getThreadById(req.params.id as string);
  sendSuccess(res, thread, 'Thread fetched successfully');
});

export const createComment = catchAsync(async (req: Request, res: Response) => {
  const comment = await forumService.createComment(req.body, req.params.threadId as string, req.user.id);
  sendSuccess(res, comment, 'Comment added successfully', 201);
});

export const deleteThread = catchAsync(async (req: Request, res: Response) => {
  await forumService.deleteThread(req.params.id as string);
  sendSuccess(res, null, 'Thread deleted successfully');
});
