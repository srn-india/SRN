import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { createCanvas } from 'canvas';
import adminRoutes from '../modules/admin/admin.routes';
import { prisma } from '../lib/prisma';
import { generateAccessToken } from '../utils/jwt';
import { uploadToSupabase } from '../utils/upload';
import { generateAndUploadIdCard } from '../modules/membership/idcard.service';

jest.mock('../lib/prisma', () => ({ prisma: { user: { findUnique: jest.fn(), update: jest.fn() }, membership: { findFirst: jest.fn() } } }));
jest.mock('../lib/cache', () => ({ redis: { get: jest.fn().mockResolvedValue(null) } }));
jest.mock('../lib/supabase', () => ({ supabase: {} }));
jest.mock('../utils/upload', () => { const actual = jest.requireActual('../utils/upload'); return { ...actual, uploadToSupabase: jest.fn() }; });
jest.mock('../modules/membership/idcard.service', () => ({ generateAndUploadIdCard: jest.fn() }));
const app = express();
app.use('/api/admin', adminRoutes);
app.use((err: any, req: Request, res: Response, next: NextFunction) => res.status(err.statusCode || 400).json({ message: err.message }));
const photo = createCanvas(2, 2).toBuffer('image/png');
const token = (role: string) => generateAccessToken({ id: role.toLowerCase(), role: role as any });
const db = prisma as any;
beforeEach(() => {
  jest.clearAllMocks();
  db.user.findUnique.mockImplementation(async ({ where }: any) => where.id === 'missing' ? null : ({ id: where.id, role: where.id === 'admin' ? 'ADMIN' : 'USER', avatar: 'old.png' }));
  db.user.update.mockResolvedValue({ id: 'target', avatar: 'https://example.com/new.png' });
  db.membership.findFirst.mockResolvedValue(null);
  (uploadToSupabase as jest.Mock).mockResolvedValue('https://example.com/new.png');
  (generateAndUploadIdCard as jest.Mock).mockResolvedValue('https://example.com/id.png');
});
const upload = (auth?: string, image = photo, type = 'image/png', id = 'target') => {
  const req = request(app).patch(`/api/admin/users/${id}/avatar`);
  if (auth) req.set('Authorization', `Bearer ${auth}`);
  return req.attach('avatar', image, { filename: 'photo.png', contentType: type });
};
test('admin can upload a photo for another user', async () => {
  const res = await upload(token('ADMIN'));
  expect(res.status).toBe(200);
  expect(res.body.data.avatar).toBe('https://example.com/new.png');
  expect(db.user.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'target' }, data: { avatar: 'https://example.com/new.png' } }));
});
test.each([undefined, 'USER', 'MEMBER'])('non-admin %s cannot upload another user photo', async role => {
  const res = await upload(role ? token(role) : undefined);
  expect(res.status).toBe(role ? 403 : 401);
  expect(uploadToSupabase).not.toHaveBeenCalled();
  expect(db.user.update).not.toHaveBeenCalled();
});
test.each([[Buffer.from('not an image'), 'image/png'], [photo, 'image/svg+xml'], [photo, 'application/pdf']])('rejects invalid image bytes or types', async (bytes, type) => {
  const res = await upload(token('ADMIN'), bytes as Buffer, type as string);
  expect(res.status).toBe(400);
  expect(db.user.update).not.toHaveBeenCalled();
});
test('missing target is rejected before storage upload', async () => {
  expect((await upload(token('ADMIN'), photo, 'image/png', 'missing')).status).toBe(404);
  expect(uploadToSupabase).not.toHaveBeenCalled();
});
test('active membership ID card is refreshed', async () => {
  db.membership.findFirst.mockResolvedValue({ id: 'membership' });
  expect((await upload(token('ADMIN'))).status).toBe(200);
  expect(generateAndUploadIdCard).toHaveBeenCalledWith('membership');
});
test('upload failure preserves the previous image', async () => {
  (uploadToSupabase as jest.Mock).mockRejectedValueOnce(new Error('Storage unavailable'));
  expect((await upload(token('ADMIN'))).status).toBeGreaterThanOrEqual(400);
  expect(db.user.update).not.toHaveBeenCalled();
});
test('missing file is rejected', async () => {
  const res = await request(app).patch('/api/admin/users/target/avatar').set('Authorization', `Bearer ${token('ADMIN')}`);
  expect(res.status).toBe(400);
});

test('a forged admin role claim cannot override the database role', async () => {
  const forgedRole = generateAccessToken({ id: 'user', role: 'ADMIN' });
  expect((await upload(forgedRole)).status).toBe(403);
  expect(uploadToSupabase).not.toHaveBeenCalled();
});
test('oversized files are rejected before storage', async () => {
  expect((await upload(token('ADMIN'), Buffer.alloc(5 * 1024 * 1024 + 1))).status).toBe(400);
  expect(uploadToSupabase).not.toHaveBeenCalled();
});
test('oversized image dimensions are rejected', async () => {
  expect((await upload(token('ADMIN'), createCanvas(4097, 1).toBuffer('image/png'))).status).toBe(400);
  expect(uploadToSupabase).not.toHaveBeenCalled();
});
test('a corrupt PNG with a valid header is rejected', async () => {
  expect((await upload(token('ADMIN'), photo.subarray(0, 16))).status).toBe(400);
  expect(uploadToSupabase).not.toHaveBeenCalled();
});
test('ID card failures are reported without losing the saved profile photo', async () => {
  db.membership.findFirst.mockResolvedValue({ id: 'membership' });
  (generateAndUploadIdCard as jest.Mock).mockResolvedValueOnce(null);
  const res = await upload(token('ADMIN'));
  expect(res.status).toBe(200);
  expect(res.body.data.avatar).toBe('https://example.com/new.png');
  expect(res.body.data.idCardWarning).toContain('could not be refreshed');
});
