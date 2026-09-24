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

    const cleanPhone = phone ? String(phone).trim() : null;
    const idNum = govIdNumber ? String(govIdNumber).trim() : (panNumber ? String(panNumber).trim() : null);
    const pan = (govIdType === 'PAN' ? (govIdNumber ? String(govIdNumber).trim() : null) : (panNumber ? String(panNumber).trim() : null));

    const cleanEmail = email ? email.toLowerCase().trim() : null;

    if (!userId) {
      if (!cleanPhone && !cleanEmail) {
        return res.status(400).json({ success: false, message: 'Phone number is required for registration' });
      }
      let user = cleanEmail 
        ? await prisma.user.findUnique({ where: { email: cleanEmail } }) 
        : (cleanPhone ? await prisma.user.findFirst({ where: { phone: cleanPhone } }) : null);

      // Validate email uniqueness
      if (cleanEmail) {
        const existingEmailUser = await prisma.user.findFirst({
          where: {
            email: cleanEmail,
            ...(user ? { id: { not: user.id } } : {})
          }
        });
        if (existingEmailUser) {
          return res.status(400).json({ success: false, message: 'This email address is already registered with another account/member.' });
        }
      }

      // Validate phone uniqueness
      if (cleanPhone) {
        const existingPhone = await prisma.user.findFirst({
          where: {
            phone: cleanPhone,
            ...(user ? { id: { not: user.id } } : {})
          }
        });
        if (existingPhone) {
          return res.status(400).json({ success: false, message: 'This phone number is already registered with another account/member.' });
        }
      }

      // Validate government ID uniqueness
      if (idNum) {
        const existingGov = await prisma.user.findFirst({
          where: {
            govIdNumber: idNum,
            ...(user ? { id: { not: user.id } } : {})
          }
        });
        if (existingGov) {
          return res.status(400).json({ success: false, message: 'This Government ID number is already registered with another member.' });
        }
      }

      // Validate PAN uniqueness
      if (pan) {
        const existingPan = await prisma.user.findFirst({
          where: {
            panNumber: pan,
            ...(user ? { id: { not: user.id } } : {})
          }
        });
        if (existingPan) {
          return res.status(400).json({ success: false, message: 'This PAN number is already registered with another member.' });
        }
      }

      if (!user) {
        user = await prisma.user.create({
          data: {
            firstName: firstName || 'Member',
            lastName: lastName || '',
            email: cleanEmail,
            phone: cleanPhone,
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
            phone: cleanPhone || user.phone,
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
      // User is logged in: validate and update profile
      if (cleanPhone) {
        const existingPhone = await prisma.user.findFirst({
          where: {
            phone: cleanPhone,
            id: { not: userId }
          }
        });
        if (existingPhone) {
          return res.status(400).json({ success: false, message: 'This phone number is already registered with another account/member.' });
        }
      }

      if (idNum) {
        const existingGov = await prisma.user.findFirst({
          where: {
            govIdNumber: idNum,
            id: { not: userId }
          }
        });
        if (existingGov) {
          return res.status(400).json({ success: false, message: 'This Government ID number is already registered with another member.' });
        }
      }

      if (pan) {
        const existingPan = await prisma.user.findFirst({
          where: {
            panNumber: pan,
            id: { not: userId }
          }
        });
        if (existingPan) {
          return res.status(400).json({ success: false, message: 'This PAN number is already registered with another member.' });
        }
      }

      if (cleanEmail) {
        const existingEmailUser = await prisma.user.findFirst({
          where: {
            email: cleanEmail,
            id: { not: userId }
          }
        });
        if (existingEmailUser) {
          return res.status(400).json({ success: false, message: 'This email address is already registered with another account/member.' });
        }
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          email: cleanEmail || undefined,
          phone: cleanPhone || undefined,
          gender: gender || undefined,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          govIdType: govIdType || undefined,
          govIdNumber: idNum || undefined,
          panNumber: pan || undefined,
          state: state || undefined,
          district: district || undefined,
          avatar: profilePicture || undefined,
        }
      }).catch(console.error);
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

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await service.deletePayment(id as string);
    res.json({ success: true, message: 'Payment record removed successfully', data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const cleanupPayments = async (req: Request, res: Response) => {
  try {
    const { status, olderThanDays } = req.query;
    const result = await service.cleanupPayments({
      status: status as string,
      olderThanDays: olderThanDays ? parseInt(olderThanDays as string, 10) : undefined,
    });
    res.json({ success: true, message: `Removed ${result.count} payment record(s)`, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

