import request from 'supertest';
import app from '../index';
import { prisma } from '../lib/prisma';
import { setupTestDB, closeConnections } from './setup';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../utils/jwt';

describe('Posts Module', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    await setupTestDB();
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create Admin
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: { role: 'ADMIN', isVerified: true, password: hashedPassword },
      create: { firstName: 'Admin', lastName: 'User', phone: '1234567890', state: 'Delhi', district: 'New Delhi', gender: 'Male', email: 'admin@test.com', password: hashedPassword, role: 'ADMIN', isVerified: true }
    });
    adminToken = generateAccessToken({ id: adminUser.id, role: adminUser.role });

    // Create User
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: { role: 'USER', isVerified: true, password: hashedPassword },
      create: { firstName: 'User', lastName: 'Test', phone: '0987654321', state: 'Delhi', district: 'New Delhi', gender: 'Female', email: 'user@test.com', password: hashedPassword, role: 'USER', isVerified: true }
    });
    userToken = generateAccessToken({ id: regularUser.id, role: regularUser.role });
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should create a post as admin', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Post',
        content: 'Test Content',
        slug: 'test-post',
        isPremium: false
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Test Post');
  });

  it('should not create a post as regular user', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'User Post',
        content: 'User Content',
        slug: 'user-post'
      });

    expect(res.status).toBe(403);
  });

  it('should get all posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body.data.posts.length).toBeGreaterThan(0);
  });

  it('should check premium content access', async () => {
    // Create premium post
    const post = await prisma.post.create({
      data: {
        title: 'Premium Post',
        content: 'Secret Content',
        slug: 'premium-post',
        isPremium: true,
        authorId: (await prisma.user.findUnique({ where: { email: 'admin@test.com' } }))!.id
      }
    });

    // Public access
    const resPublic = await request(app).get(`/api/posts/${post.id}`);
    expect(resPublic.status).toBe(401);

    // Regular user access
    const resUser = await request(app)
      .get(`/api/posts/${post.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(resUser.status).toBe(403);

    // Admin access
    const resAdmin = await request(app)
      .get(`/api/posts/${post.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resAdmin.status).toBe(200);
  });
});
