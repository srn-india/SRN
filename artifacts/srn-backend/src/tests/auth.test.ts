import request from 'supertest';
import app from '../index';
import { prisma } from '../lib/prisma';
import { setupTestDB, closeConnections } from './setup';

describe('Auth Module', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeConnections();
  });

  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    phone: '1234567890',
    state: 'Delhi',
    district: 'New Delhi',
    gender: 'Male',
    email: 'test@example.com',
    password: 'password123',
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.requiresOtp).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
  });

  it('should not register user with existing email', async () => {
    // Ensure the user actually exists right before testing
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await prisma.user.upsert({
      where: { email: testUser.email },
      update: { password: hashedPassword },
      create: { ...testUser, password: hashedPassword }
    });
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should login user', async () => {
    // Manually verify user so we can get an access token
    await prisma.user.update({
      where: { email: testUser.email },
      data: { isVerified: true }
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should get current user profile', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const token = loginRes.body.data.accessToken;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('should logout user', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const token = loginRes.body.data.accessToken;

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.header['set-cookie']).toBeDefined();
  });
});
