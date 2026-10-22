import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { verifyPayment } from '../modules/payment/payment.service';
import { generateReceiptPdf } from '../utils/receipt.service';
import { sendEmail } from '../utils/email.service';

jest.mock('../lib/prisma', () => ({ prisma: {
  payment: { findUnique: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
  user: { findUnique: jest.fn() }, $transaction: jest.fn(),
} }));
jest.mock('razorpay', () => jest.fn().mockImplementation(() => ({ orders: {} })));
jest.mock('../utils/email.service', () => ({ sendEmail: jest.fn().mockResolvedValue({}) }));
jest.mock('../utils/storage.service', () => ({ uploadPaymentReport: jest.fn().mockResolvedValue('https://example.com/report.xlsx') }));
jest.mock('../utils/receipt.service', () => ({ generateReceiptPdf: jest.fn() }));
jest.mock('../modules/membership/membership.service', () => ({ subscribeUser: jest.fn() }));

const payment = { id: 'online-1', userId: 'donor-1', amount: 1500, type: 'DONATION', status: 'PENDING', razorpayOrderId: 'order-1', createdAt: new Date() };
const tx = { payment: { update: jest.fn() }, user: { findUnique: jest.fn() }, donation: { create: jest.fn() }, manualPayment: { create: jest.fn() } };
const user = { id: 'donor-1', firstName: 'Test', lastName: 'Donor', email: 'donor@example.com' };
const data = () => ({ razorpay_order_id: 'order-1', razorpay_payment_id: 'pay-1', razorpay_signature: crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update('order-1|pay-1').digest('hex') });
beforeEach(() => {
  jest.clearAllMocks();
  (prisma.payment.findUnique as jest.Mock).mockResolvedValue(payment);
  (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
  (prisma.$transaction as jest.Mock).mockImplementation(fn => fn(tx));
  tx.payment.update.mockResolvedValue({ ...payment, status: 'SUCCESS', razorpayPaymentId: 'pay-1' });
  tx.user.findUnique.mockResolvedValue(user);
});
test('online donation creates a pending admin review and sends no receipt', async () => {
  const result = await verifyPayment({ ...data(), purpose: 'Education' }, user.id);
  expect(result.reviewStatus).toBe('ADMIN_REVIEW');
  expect(tx.manualPayment.create).toHaveBeenCalledWith({ data: expect.objectContaining({ id: 'razorpay:online-1', status: 'PENDING', amount: 1500, utrNumber: 'pay-1' }) });
  expect(generateReceiptPdf).not.toHaveBeenCalled();
  const donorEmail = (sendEmail as jest.Mock).mock.calls.find(call => call[0] === user.email);
  expect(donorEmail?.[2]).toContain('after approval');
  expect(donorEmail?.[4]).toBeUndefined();
});
test('repeated verification does not create a second review or receipt', async () => {
  (prisma.payment.findUnique as jest.Mock).mockResolvedValue({ ...payment, status: 'SUCCESS' });
  await verifyPayment(data(), user.id);
  expect(prisma.$transaction).not.toHaveBeenCalled();
  expect(generateReceiptPdf).not.toHaveBeenCalled();
});
test('invalid signatures cannot enter the review queue', async () => {
  await expect(verifyPayment({ ...data(), razorpay_signature: 'invalid' }, user.id)).rejects.toThrow('Invalid payment signature');
  expect(prisma.$transaction).not.toHaveBeenCalled();
});

test('admin is still notified when the donor acknowledgment fails', async () => {
  (sendEmail as jest.Mock).mockRejectedValueOnce(new Error('Donor email failed'));
  await verifyPayment(data(), user.id);
  expect((sendEmail as jest.Mock).mock.calls.some(call => call[0] !== user.email && call[2].includes('Admin approval is required'))).toBe(true);
});
