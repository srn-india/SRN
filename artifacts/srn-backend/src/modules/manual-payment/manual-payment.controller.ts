import { Request, Response } from 'express';
import * as service from './manual-payment.service';
import { upload, uploadToSupabase } from '../../utils/upload';

export const submit = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { amount, type, utrNumber, screenshot, purpose } = req.body;
    if (!amount || !type || !utrNumber) {
      return res.status(400).json({ success: false, message: 'amount, type and utrNumber are required' });
    }
    const payment = await service.submitPayment(userId, { amount, type, utrNumber, screenshot, purpose });
    res.json({ success: true, message: 'Payment submitted for verification', data: payment });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const payments = await service.getMyPayments(userId);
    res.json({ success: true, data: payments });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const payments = await service.getAllPayments(status as string);
    res.json({ success: true, data: payments });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approvePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;
    const result = await service.approvePayment(id as string, adminNote as string);
    res.json({ success: true, message: 'Payment approved', data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const rejectPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;
    if (!adminNote) return res.status(400).json({ success: false, message: 'adminNote (reason) is required for rejection' });
    const result = await service.rejectPayment(id as string, adminNote as string);
    res.json({ success: true, message: 'Payment rejected', data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const sendIdCard = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await service.sendIdCard(userId as string);
    res.json({ success: true, message: 'ID card email sent', data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const uploadScreenshot = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file as Express.Multer.File;
    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = await uploadToSupabase(file, 'complaints', 'manual-payments');
    res.json({ success: true, data: { url } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
