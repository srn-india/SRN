import { Request, Response } from 'express';
import * as service from './manual-payment.service';
import { upload, uploadToSupabase } from '../../utils/upload';
import { prisma } from '../../lib/prisma';

export const submit = async (req: Request, res: Response) => {
  try {
    let userId = (req as any).user?.id;
    const { 
      amount, 
      type, 
      utrNumber, 
      screenshot, 
      purpose, 
      email,
      firstName,
      lastName,
      phone,
      gender,
      dateOfBirth,
      govIdType,
      govIdNumber,
      panNumber,
      state,
      district,
      profilePicture 
    } = req.body;

    if (!amount || !type || !utrNumber) {
      return res.status(400).json({ success: false, message: 'amount, type and utrNumber are required' });
    }

    if (!userId) {
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required for registration' });
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
    }

    const payment = await service.submitPayment(userId, { amount, type, utrNumber, screenshot, purpose, email });
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
