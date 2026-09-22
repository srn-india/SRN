import { Request, Response } from 'express';
import * as paymentService from './payment.service';
import { prisma } from '../../lib/prisma';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';

export const getRazorpayKey = catchAsync(async (req: Request, res: Response) => {
  sendSuccess(res, { keyId: process.env.RAZORPAY_KEY_ID }, 'Razorpay Key ID');
});

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { amount, type, email, firstName, lastName, phone, panNumber, state, city, address } = req.body;
  let userId = (req as any).user?.id;

  if (!userId) {
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required for donation payment' });
    }
    const cleanEmail = email.trim().toLowerCase();
    let user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          firstName: firstName?.trim() || 'Supporter',
          lastName: lastName?.trim() || 'Donor',
          phone: phone?.trim() || null,
          panNumber: panNumber ? panNumber.toUpperCase().trim() : null,
          state: state?.trim() || null,
          district: city?.trim() || null,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: user.firstName || firstName?.trim() || undefined,
          lastName: user.lastName || lastName?.trim() || undefined,
          phone: user.phone || phone?.trim() || undefined,
          panNumber: (user as any).panNumber || (panNumber ? panNumber.toUpperCase().trim() : undefined),
          state: user.state || state?.trim() || undefined,
          district: user.district || city?.trim() || undefined,
        },
      });
    }
    userId = user.id;
  }

  const order = await paymentService.createOrder(userId, amount, type);
  sendSuccess(res, order, 'Payment order created', 201);
});

export const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const result = await paymentService.verifyPayment(req.body, userId);
    sendSuccess(res, result, 'Payment verified and membership/donation activated');
  } catch (error: any) {
    console.error("verifyPayment Error Details:", error);
    res.status(500).json({ status: 'error', message: error.message || 'Payment verification failed' });
  }
});

