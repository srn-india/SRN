import { Request, Response } from 'express';
import * as paymentService from './payment.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';

export const getRazorpayKey = catchAsync(async (req: Request, res: Response) => {
  sendSuccess(res, { keyId: process.env.RAZORPAY_KEY_ID }, 'Razorpay Key ID');
});

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { amount, type } = req.body;
  const order = await paymentService.createOrder(req.user.id, amount, type);
  sendSuccess(res, order, 'Payment order created', 201);
});

export const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.verifyPayment(req.body, req.user.id);
  sendSuccess(res, result, 'Payment verified and membership activated');
});
