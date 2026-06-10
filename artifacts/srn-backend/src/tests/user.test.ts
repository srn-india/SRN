import request from 'supertest';
import app from '../index';
import { prisma } from '../lib/prisma';
import { setupTestDB, closeConnections } from './setup';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../utils/jwt';

// Mock Supabase to prevent actual uploads during testing
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn().mockReturnValue({
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({ data: { path: 'fake-path.jpg' }, error: null }),
          getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://dummy.supabase.co/fake-path.jpg' } })
        })
      }
    })
  };
});

describe('User Profile Module', () => {
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    await setupTestDB();
    
    // Create an initial user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'avatar@test.com' },
      update: { isVerified: true, password: hashedPassword },
      create: { 
        firstName: 'Avatar', 
        lastName: 'Tester',
        phone: '1234567890',
        email: 'avatar@test.com', 
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

  it('should get current user profile with correct payload schema', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.firstName).toBe('Avatar');
    // Ensure avatar is mapped correctly
    expect(res.body.data.avatar).toBeUndefined(); // Backend shouldn't leak 'avatar' column directly anymore
    expect(res.body.data).toHaveProperty('profilePicture');
  });

  it('should successfully parse and upload base64 avatar', async () => {
    // A tiny 1x1 base64 GIF string for testing
    const base64Image = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    
    const res = await request(app)
      .patch('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        profilePicture: base64Image,
        firstName: 'AvatarUpdated'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.firstName).toBe('AvatarUpdated');
    expect(res.body.data.profilePicture).toBe('https://dummy.supabase.co/fake-path.jpg');
    
    // Verify DB update
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.avatar).toBe('https://dummy.supabase.co/fake-path.jpg');
    expect(user?.firstName).toBe('AvatarUpdated');
  });
});
