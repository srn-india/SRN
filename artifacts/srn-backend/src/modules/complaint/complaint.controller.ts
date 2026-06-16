import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as complaintService from './complaint.service';
import { uploadToSupabase } from '../../utils/upload';

export const createComplaint = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = req.body;
  let fileUrl = null;

  if (req.file) {
    fileUrl = await uploadToSupabase(req.file, 'complaints', 'documents');
  }

  const complaint = await complaintService.createComplaint(userId, { ...data, fileUrl });
  sendSuccess(res, complaint, 'Complaint submitted successfully', 201);
});

export const getComplaints = catchAsync(async (req: Request, res: Response) => {
  const complaints = await complaintService.getComplaints();
  sendSuccess(res, complaints, 'Complaints retrieved successfully', 200);
});

export const getComplaintById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const complaint = await complaintService.getComplaintById(id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }
  sendSuccess(res, complaint, 'Complaint retrieved successfully', 200);
});

export const getMyComplaints = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const complaints = await complaintService.getComplaintsByUser(userId);
  sendSuccess(res, complaints, 'User complaints retrieved successfully', 200);
});

export const updateComplaintStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const complaint = await complaintService.updateComplaintStatus(id, status);
  sendSuccess(res, complaint, 'Complaint status updated successfully', 200);
});

export const deleteComplaint = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await complaintService.deleteComplaint(id);
  sendSuccess(res, null, 'Complaint deleted successfully', 200);
});

export const getPublishedComplaints = catchAsync(async (req: Request, res: Response) => {
  const complaints = await complaintService.getPublishedComplaints();
  sendSuccess(res, complaints, 'Published complaints retrieved successfully', 200);
});

export const publishComplaint = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = req.body;
  const complaint = await complaintService.publishComplaint(id, data);
  sendSuccess(res, complaint, 'Complaint publication status updated successfully', 200);
});
