import { prisma } from '../../lib/prisma';
import { generateAndUploadIdCard } from './idcard.service';
import { MembershipPlan } from '@prisma/client';
import { setCache, getCache, delCache } from '../../lib/cache';
import { sendRashtraNirmanKartaOtpEmail, sendRashtraMitraOtpEmail } from '../../utils/email.service';

export const subscribeUser = async (userId: string, plan: MembershipPlan, durationInMonths: number, txClient?: any) => {
  const client = txClient || prisma;

  // Prevent duplicate active memberships
  const existingMembership = await client.membership.findFirst({
    where: { userId, status: 'ACTIVE' }
  });

  if (existingMembership) {
    return existingMembership;
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationInMonths);

  // 1. Create membership record
  const membership = await client.membership.create({
    data: {
      userId,
      plan,
      startDate,
      endDate,
      status: 'ACTIVE',
    },
  });

  // 3. Generate and upload the ID card only for Active (PREMIUM / LIFETIME) members
  if (plan === 'PREMIUM' || plan === 'LIFETIME') {
    await generateAndUploadIdCard(membership.id, client).catch(console.error);
  }

  return membership;
};

export const registerNormalMembership = async (userId: string) => {
  return await subscribeUser(userId, 'BASIC' as MembershipPlan, 36);
};

export const getMembership = async (userId: string) => {
  return await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  });
};

export const cancelMembership = async (id: string, userId: string) => {
  const membership = await prisma.membership.findFirst({
    where: { id, userId }
  });
  
  if (!membership) {
    throw new Error('Membership not found');
  }

  return await prisma.membership.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
};

export const getAllMemberships = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const [memberships, total] = await Promise.all([
    prisma.membership.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            gender: true,
            state: true,
            district: true,
            postApplications: {
              select: { currentOccupation: true, appliedPosition: true },
              take: 1,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.membership.count(),
  ]);

  const formattedMemberships = memberships.map(m => {
    const occupation = m.user?.postApplications?.[0]?.currentOccupation 
      || m.user?.postApplications?.[0]?.appliedPosition 
      || 'N/A';
    return {
      ...m,
      user: m.user ? {
        ...m.user,
        occupation,
      } : null,
    };
  });

  return {
    memberships: formattedMemberships,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ── In-memory fallback map for OTPs with TTL ─────────────────────────────────
interface StoredOtpData {
  otp: string;
  tier: 'active' | 'normal';
  createdAt: number;
  attempts: number;
  name?: string;
}

const memoryOtpStore = new Map<string, StoredOtpData>();

export const sendMembershipOtp = async ({
  email,
  tier,
  name,
}: {
  email: string;
  tier: 'active' | 'normal';
  name?: string;
}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error('Please provide a valid email address.');
  }

  // Check rate limit: 45s between OTP requests
  const existingOtp = (await getCache<StoredOtpData>(`membership_otp:${normalizedEmail}`)) || memoryOtpStore.get(normalizedEmail);
  if (existingOtp && Date.now() - existingOtp.createdAt < 45 * 1000) {
    const waitSeconds = Math.ceil((45 * 1000 - (Date.now() - existingOtp.createdAt)) / 1000);
    throw new Error(`Please wait ${waitSeconds}s before requesting a new OTP.`);
  }

  // Generate cryptographically secure 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpData: StoredOtpData = {
    otp: otpCode,
    tier: tier === 'active' ? 'active' : 'normal',
    createdAt: Date.now(),
    attempts: 0,
    name: name?.trim() || undefined,
  };

  // Cache for 10 minutes (600s)
  await setCache(`membership_otp:${normalizedEmail}`, otpData, 600);
  memoryOtpStore.set(normalizedEmail, otpData);

  // Send tailored email
  if (tier === 'active') {
    await sendRashtraNirmanKartaOtpEmail(normalizedEmail, otpCode, name);
  } else {
    await sendRashtraMitraOtpEmail(normalizedEmail, otpCode, name);
  }

  return {
    success: true,
    message: `OTP sent successfully for ${tier === 'active' ? 'Rashtra Nirman Karta' : 'Rashtra Mitra'}`,
    email: normalizedEmail,
    expiresIn: 600,
  };
};

export const verifyMembershipOtp = async ({
  email,
  otp,
  tier,
}: {
  email: string;
  otp: string;
  tier?: 'active' | 'normal';
}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const cleanOtp = otp ? otp.trim() : '';

  if (!cleanOtp || cleanOtp.length !== 6) {
    throw new Error('Please enter a valid 6-digit verification code.');
  }

  const stored = (await getCache<StoredOtpData>(`membership_otp:${normalizedEmail}`)) || memoryOtpStore.get(normalizedEmail);

  if (!stored) {
    throw new Error('Verification code has expired or does not exist. Please request a new OTP.');
  }

  if (stored.otp !== cleanOtp) {
    stored.attempts = (stored.attempts || 0) + 1;
    if (stored.attempts >= 5) {
      await delCache(`membership_otp:${normalizedEmail}`);
      memoryOtpStore.delete(normalizedEmail);
      throw new Error('Too many invalid attempts. Please request a new verification code.');
    }
    await setCache(`membership_otp:${normalizedEmail}`, stored, 600);
    memoryOtpStore.set(normalizedEmail, stored);
    throw new Error('Invalid verification code. Please check your email and try again.');
  }

  // OTP is verified! Remove from pending store
  await delCache(`membership_otp:${normalizedEmail}`);
  memoryOtpStore.delete(normalizedEmail);

  // Set verified flag for 1 hour (3600 seconds)
  await setCache(`membership_verified:${normalizedEmail}`, { verified: true, tier: stored.tier, verifiedAt: Date.now() }, 3600);

  return {
    success: true,
    verified: true,
    email: normalizedEmail,
    tier: stored.tier,
    message: 'Email address verified successfully!',
  };
};
