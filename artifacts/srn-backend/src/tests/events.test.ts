import request from 'supertest';
import app from '../index';
import { prisma } from '../lib/prisma';
import { setupTestDB, closeConnections } from './setup';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../utils/jwt';

describe('Events Module', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    await setupTestDB();

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: { role: 'ADMIN', isVerified: true, password: hashedPassword },
      create: {
        firstName: 'Admin',
        lastName: 'User',
        phone: '1234567890',
        state: 'Delhi',
        district: 'New Delhi',
        gender: 'Male',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true
      }
    });
    adminToken = generateAccessToken({ id: adminUser.id, role: adminUser.role });

    // Create User
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: { role: 'USER', isVerified: true, password: hashedPassword },
      create: {
        firstName: 'User',
        lastName: 'Test',
        phone: '0987654321',
        state: 'Delhi',
        district: 'New Delhi',
        gender: 'Female',
        email: 'user@test.com',
        password: hashedPassword,
        role: 'USER',
        isVerified: true
      }
    });
    userToken = generateAccessToken({ id: regularUser.id, role: regularUser.role });
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should return 404 when deleting an event that does not exist', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app)
      .delete(`/api/events/${nonExistentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Record not found');
  });
});
