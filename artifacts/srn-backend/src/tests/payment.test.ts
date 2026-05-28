import request from 'supertest';
import app from '../index';
import { prisma } from '../lib/prisma';
import { setupTestDB, closeConnections } from './setup';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../utils/jwt';

describe('Payment & Membership Module', () => {
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    await setupTestDB();
    
    // Register User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'payer@test.com' },
      update: { isVerified: true, password: hashedPassword },
      create: { 
        firstName: 'Test', 
        lastName: 'Payer',
        phone: '1234567890',
        state: 'Delhi',
        district: 'New Delhi',
        gender: 'Male',
        email: 'payer@test.com', 
        password: hashedPassword,
        isVerified: true
      }
    });

    userToken = generateAccessToken({ id: user.id, role: user.role });
    userId = user.id;
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should create a payment order', async () => {
    const res = await request(app)
      .post('/api/payments/order')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        amount: 999,
        currency: 'INR'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.amount).toBe(999);
    expect(res.body.data.status).toBe('PENDING');
  });

  it('should verify payment and activate membership', async () => {
    // Create order first
    const orderRes = await request(app)
      .post('/api/payments/order')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 999 });

    const paymentId = orderRes.body.data.id;
    const razorpay_order_id = orderRes.body.data.transactionId;
    const razorpay_payment_id = 'fake_payment_id';

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(body.toString())
      .digest('hex');

    const res = await request(app)
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: expectedSignature

      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('SUCCESS');

    // Check if user is now a MEMBER
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.role).toBe('MEMBER');

    // Check membership record
    const membership = await prisma.membership.findFirst({ where: { userId } });
    expect(membership).toBeDefined();
    expect(membership?.status).toBe('ACTIVE');
  });

  it('should get current user membership', async () => {
    const res = await request(app)
      .get('/api/memberships/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.plan).toBe('PREMIUM');
  });
});
