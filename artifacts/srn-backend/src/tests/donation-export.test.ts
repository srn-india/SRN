import express from 'express';
import request from 'supertest';
import * as XLSX from 'xlsx';
import { prisma } from '../lib/prisma';
import { exportDonations, submitPayment, cleanupPayments } from '../modules/manual-payment/manual-payment.service';
import routes from '../modules/manual-payment/manual-payment.routes';
import { generateAccessToken } from '../utils/jwt';

jest.mock('../lib/prisma', () => ({ prisma: {
  manualPayment: { findMany: jest.fn(), create: jest.fn(), deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
  payment: { findMany: jest.fn() }, user: { findUnique: jest.fn() },
} }));
jest.mock('../lib/cache', () => ({ redis: { get: jest.fn().mockResolvedValue(null) } }));
jest.mock('../utils/upload', () => ({ upload: { single: () => (_req: any, _res: any, next: any) => next() }, uploadToSupabase: jest.fn() }));
jest.mock('../utils/email.service', () => ({ sendEmail: jest.fn().mockResolvedValue({}) }));
jest.mock('../utils/receipt.service', () => ({ generateReceiptPdf: jest.fn() }));
jest.mock('../modules/membership/membership.service', () => ({}));
jest.mock('../modules/membership/idcard.service', () => ({}));
const db = prisma as any;
const donor = { firstName: 'Test', lastName: 'Donor', email: 'donor@example.com', phone: '0123456789' };
const manual = { id: 'manual-1', amount: 1500, type: 'DONATION', utrNumber: '00123', purpose: '[BANK TRANSFER] Education', status: 'PENDING', createdAt: new Date('2026-11-18T00:00:00Z'), user: donor, referrerName: 'सीमा शर्मा' };
const app = express();
app.use(express.json());
app.use('/api/manual-payments', routes);
beforeEach(() => {
  jest.clearAllMocks();
  db.manualPayment.findMany.mockResolvedValue([manual]);
  db.payment.findMany.mockResolvedValue([]);
  db.manualPayment.create.mockImplementation(async ({ data }: any) => ({ ...manual, ...data }));
  db.user.findUnique.mockImplementation(async ({ where }: any) => ({ id: where.id, role: where.id === 'admin' ? 'ADMIN' : 'USER' }));
});
test('manual referral is trimmed and optional on older submissions', async () => {
  const details = { amount: 1500, type: 'DONATION' as const, utrNumber: '00123' };
  expect((await submitPayment('donor', { ...details, referrerName: '  सीमा शर्मा  ' })).referrerName).toBe('सीमा शर्मा');
  expect((await submitPayment('donor', details)).referrerName).toBeNull();
  expect((await submitPayment('donor', { ...details, referrerName: '   ' })).referrerName).toBeNull();
});
test.each([123, {}, 'a'.repeat(151)])('invalid referral is rejected before any write', async value => {
  await expect(submitPayment('donor', { amount: 1000, type: 'DONATION', utrNumber: '123', referrerName: value as any })).rejects.toThrow();
  expect(db.manualPayment.create).not.toHaveBeenCalled();
  const res = await request(app).post('/api/manual-payments/submit').send({ amount: 1000, type: 'DONATION', utrNumber: '123', referrerName: value });
  expect(res.status).toBe(400);
  expect(db.user.findUnique).not.toHaveBeenCalled();
});
test('Excel includes every review status, historical online payments, and no duplicate online reviews', async () => {
  db.manualPayment.findMany.mockResolvedValue([manual, { ...manual, id: 'razorpay:online-1', status: 'APPROVED' }, { ...manual, id: 'rejected', status: 'REJECTED', referrerName: null }]);
  db.payment.findMany.mockResolvedValue(['online-1', 'historical'].map(id => ({ ...manual, id, razorpayPaymentId: 'pay-1', referrerName: null, donation: { purpose: 'Health' } })));
  const book = XLSX.read(await exportDonations(), { type: 'buffer' });
  const rows = XLSX.utils.sheet_to_json<any>(book.Sheets.Donations);
  expect(rows).toHaveLength(4);
  expect(rows.map(row => row['Review Status'])).toEqual(expect.arrayContaining(['PENDING', 'APPROVED', 'REJECTED', 'REVIEW RECORD UNAVAILABLE']));
  expect(rows[0]['Referrer Name']).toBe('सीमा शर्मा');
  expect(rows[0]['Amount (INR)']).toBe(1500);
  expect(rows[0]['Transaction Reference']).toBe('00123');
  expect(rows[0].Phone).toBe('0123456789');
  expect(db.manualPayment.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { type: 'DONATION' } }));
});
test('empty export still contains column headers', async () => {
  db.manualPayment.findMany.mockResolvedValue([]);
  const sheet = XLSX.read(await exportDonations(), { type: 'buffer' }).Sheets.Donations;
  expect(XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]).toContain('Referrer Name');
});
test('spreadsheet formula-like names remain literal text', async () => {
  db.manualPayment.findMany.mockResolvedValue([{ ...manual, referrerName: '=HYPERLINK("https://example.com")' }]);
  const sheet = XLSX.read(await exportDonations(), { type: 'buffer' }).Sheets.Donations;
  expect(sheet.F2.t).toBe('s');
  expect(sheet.F2.f).toBeUndefined();
});
test.each([undefined, 'user', 'admin'])('export is restricted to database admins: %s', async id => {
  const req = request(app).get('/api/manual-payments/admin/donations/export');
  if (id) req.set('Authorization', `Bearer ${generateAccessToken({ id, role: 'ADMIN' })}`);
  const res = await req;
  expect(res.status).toBe(id === 'admin' ? 200 : id ? 403 : 401);
  if (id === 'admin') {
    expect(res.headers['content-type']).toContain('spreadsheetml.sheet');
    expect(res.headers['content-disposition']).toContain('.xlsx');
    expect(res.headers['cache-control']).toBe('no-store');
  } else expect(db.manualPayment.findMany).not.toHaveBeenCalled();
});

test('routine cleanup preserves the donation register', async () => {
  await cleanupPayments({ status: 'APPROVED' });
  expect(db.manualPayment.deleteMany).toHaveBeenCalledWith({ where: { status: 'APPROVED', type: { not: 'DONATION' } } });
});
