import { prisma } from '../lib/prisma';
import { submitPayment, approvePayment, sendDonationReceipt } from '../modules/manual-payment/manual-payment.service';
import { generateReceiptPdf } from '../utils/receipt.service';
import { sendEmail } from '../utils/email.service';

jest.mock('../lib/prisma', () => ({ prisma: { manualPayment: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() } } }));
jest.mock('../utils/receipt.service', () => ({ generateReceiptPdf: jest.fn().mockResolvedValue(Buffer.from('pdf')) }));
jest.mock('../utils/email.service', () => ({ sendEmail: jest.fn().mockResolvedValue({}) }));
jest.mock('../modules/membership/membership.service', () => ({ subscribeUser: jest.fn() }));
jest.mock('../modules/membership/idcard.service', () => ({}));

const payment = { id: 'review-1', userId: 'donor-1', amount: 1500, type: 'DONATION', status: 'PENDING', utrNumber: 'UTR123', purpose: '[UPI] Education', createdAt: new Date(), user: { firstName: 'Test', lastName: 'Donor', email: 'donor@example.com' } };
const db = prisma.manualPayment as any;
beforeEach(() => {
  jest.clearAllMocks();
  db.create.mockImplementation(async ({ data }: any) => ({ ...payment, ...data }));
  db.findUnique.mockResolvedValue(payment);
  db.update.mockImplementation(async ({ data }: any) => {
    const updated = { ...payment, ...data };
    db.findUnique.mockResolvedValue(updated);
    return updated;
  });
});
test('manual donation waits for review without generating a receipt', async () => {
  const result = await submitPayment(payment.userId, { amount: 1500, type: 'DONATION', utrNumber: 'UTR123' });
  expect(result.status).toBe('PENDING');
  expect(generateReceiptPdf).not.toHaveBeenCalled();
});
test('corrections reach the approved receipt and donor email with original values', async () => {
  const result = await (approvePayment as any)(payment.id, 'Bank statement shows a different amount', { amount: 1200, utrNumber: 'UTR456', purpose: '[UPI] Health' });
  expect(result.amount).toBe(1200);
  expect(generateReceiptPdf).toHaveBeenCalledWith(expect.objectContaining({ amount: 1200, paymentId: 'UTR456' }));
  const email = (sendEmail as jest.Mock).mock.calls.find(call => call[0] === payment.user.email);
  for (const value of ['1500', '1200', 'UTR123', 'UTR456', 'Bank statement shows a different amount']) expect(email?.[2]).toContain(value);
});
test('corrections require an explanation', async () => {
  await expect((approvePayment as any)(payment.id, '', { amount: 1200 })).rejects.toThrow(/reason|note/i);
  expect(db.update).not.toHaveBeenCalled();
});
test('already approved donations cannot generate another receipt through approval', async () => {
  db.findUnique.mockResolvedValue({ ...payment, status: 'APPROVED' });
  await expect(approvePayment(payment.id)).rejects.toThrow('Payment is not pending');
  expect(generateReceiptPdf).not.toHaveBeenCalled();
});

test.each([0, -1, NaN, Infinity, 1.001])('invalid corrected amount %s is rejected', async amount => {
  await expect(approvePayment(payment.id, 'Correction', { amount })).rejects.toThrow();
  expect(db.update).not.toHaveBeenCalled();
});
test('online payment financial facts cannot be edited', async () => {
  db.findUnique.mockResolvedValue({ ...payment, id: 'razorpay:payment-1' });
  await expect(approvePayment('razorpay:payment-1', 'Correction', { amount: 1200 })).rejects.toThrow(/cannot be changed/);
});
test('receipt delivery failures are visible and do not undo approval', async () => {
  (sendEmail as jest.Mock).mockRejectedValueOnce(new Error('Email unavailable'));
  const result = await approvePayment(payment.id);
  expect(result.status).toBe('APPROVED');
  expect(result.emailSent).toBe(false);
  expect(result.deliveryError).toContain('retry');
});
test('admin notes are escaped in donor emails', async () => {
  await approvePayment(payment.id, '<img src=x onerror=alert(1)>');
  const html = (sendEmail as jest.Mock).mock.calls[0][2];
  expect(html).not.toContain('<img');
  expect(html).toContain('&lt;img');
});

test('pending donations cannot send a receipt through the resend action', async () => {
  await expect(sendDonationReceipt(payment.id)).rejects.toThrow(/must be approved/);
  expect(generateReceiptPdf).not.toHaveBeenCalled();
  expect(sendEmail).not.toHaveBeenCalled();
});
test('a concurrent approval that loses the status update cannot issue a receipt', async () => {
  db.update.mockRejectedValueOnce(new Error('Record already reviewed'));
  await expect(approvePayment(payment.id)).rejects.toThrow('Record already reviewed');
  expect(generateReceiptPdf).not.toHaveBeenCalled();
});

test('an empty optional purpose does not require a correction reason', async () => {
  db.findUnique.mockResolvedValue({ ...payment, purpose: null });
  const result = await approvePayment(payment.id, '', { purpose: '' });
  expect(result.status).toBe('APPROVED');
});
