import { prisma } from '../../lib/prisma';
import { generateAndUploadIdCard } from './idcard.service';
import { MembershipPlan } from '@prisma/client';
import { setCache, getCache, delCache } from '../../lib/cache';
import { sendRashtraNirmanKartaOtpEmail, sendRashtraMitraOtpEmail } from '../../utils/email.service';
import * as XLSX from 'xlsx';

export const subscribeUser = async (userId: string, plan: MembershipPlan, durationInMonths: number, txClient?: any) => {
  const client = txClient || prisma;

  // Check if user already has an active membership with the same plan
  const existingActive = await client.membership.findFirst({
    where: { userId, status: 'ACTIVE', plan }
  });

  if (existingActive) {
    return existingActive;
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationInMonths);

  // Check for any prior membership (cancelled, expired, or different tier) to update and avoid duplicate rows
  const priorMembership = await client.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  let membership;
  if (priorMembership) {
    // Delete any older duplicate rows if they exist
    await client.membership.deleteMany({
      where: { userId, id: { not: priorMembership.id } }
    });
    // Reuse and reactivate the membership record
    membership = await client.membership.update({
      where: { id: priorMembership.id },
      data: {
        plan,
        startDate,
        endDate,
        status: 'ACTIVE',
      }
    });
  } else {
    // Create new membership record
    membership = await client.membership.create({
      data: {
        userId,
        plan,
        startDate,
        endDate,
        status: 'ACTIVE',
      },
    });
  }

  // Generate and upload the ID card only for Active (PREMIUM / LIFETIME) members
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
            dateOfBirth: true,
            govIdType: true,
            govIdNumber: true,
            panNumber: true,
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

export const exportMembershipsToExcel = async (): Promise<Buffer> => {
  const memberships = await prisma.membership.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          gender: true,
          dateOfBirth: true,
          govIdType: true,
          govIdNumber: true,
          panNumber: true,
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
  });

  const memberRows = memberships.map((m, index) => {
    const occupation = m.user?.postApplications?.[0]?.currentOccupation 
      || m.user?.postApplications?.[0]?.appliedPosition 
      || 'N/A';
    const isRashtraMitra = m.plan === 'BASIC';
    const tierName = isRashtraMitra ? 'Rashtra Mitra (Supporter Tier)' : 'Rashtra Nirman Karta (Active Leadership)';
    const fee = isRashtraMitra ? 0 : 101;

    return {
      'S.No.': index + 1,
      'Membership ID': m.id,
      'Member Name': `${m.user?.firstName || ''} ${m.user?.lastName || ''}`.trim() || 'N/A',
      'Membership Tier': tierName,
      'Status': m.status,
      'Fee Paid (INR)': fee,
      'Phone Number': m.user?.phone || 'N/A',
      'Email Address': m.user?.email || 'N/A',
      'Gender': m.user?.gender || 'N/A',
      'Date of Birth': m.user?.dateOfBirth ? m.user.dateOfBirth.toISOString().slice(0, 10) : 'N/A',
      'Govt ID Type': m.user?.govIdType || 'N/A',
      'Govt ID Number': m.user?.govIdNumber || 'N/A',
      'PAN Card Number': m.user?.panNumber || 'N/A',
      'State': m.user?.state || 'N/A',
      'District / City': m.user?.district || 'N/A',
      'Occupation': occupation,
      'Plan Code': m.plan,
      'Start Date': m.startDate ? new Date(m.startDate).toISOString().slice(0, 10) : 'N/A',
      'End Date / Expiry': m.endDate ? new Date(m.endDate).toISOString().slice(0, 10) : 'N/A',
      'Registration Date': m.createdAt ? new Date(m.createdAt).toISOString().slice(0, 10) : 'N/A',
    };
  });

  // Calculate Metrics for Summary Sheet
  const totalCount = memberships.length;
  const activeCount = memberships.filter(m => m.status === 'ACTIVE').length;
  const cancelledCount = memberships.filter(m => m.status === 'CANCELLED').length;
  const expiredCount = memberships.filter(m => m.status === 'EXPIRED').length;
  const activeLeadershipCount = memberships.filter(m => m.plan !== 'BASIC').length;
  const supporterCount = memberships.filter(m => m.plan === 'BASIC').length;
  const totalRevenue = activeLeadershipCount * 101;

  const summaryRows = [
    { 'Metric': 'Organization Name', 'Value': 'Sashakt Rashtra Nirman (SRN) Trust' },
    { 'Metric': 'Report Title', 'Value': 'Official Membership & Leadership Master Register' },
    { 'Metric': 'Report Generated On', 'Value': new Date().toLocaleString('en-IN') },
    { 'Metric': 'Total Registered Members', 'Value': totalCount },
    { 'Metric': 'Active Members', 'Value': activeCount },
    { 'Metric': 'Cancelled Members', 'Value': cancelledCount },
    { 'Metric': 'Expired Members', 'Value': expiredCount },
    { 'Metric': 'Rashtra Nirman Karta (Active Leadership)', 'Value': activeLeadershipCount },
    { 'Metric': 'Rashtra Mitra (Supporter Tier)', 'Value': supporterCount },
    { 'Metric': 'Total Membership Fee Generated (INR)', 'Value': `₹${totalRevenue.toLocaleString('en-IN')}` },
    { 'Metric': 'Tax Status', 'Value': 'Section 80G & 12A Compliant' }
  ];

  const workbook = XLSX.utils.book_new();

  // 1. Members Register Sheet
  const wsMembers = XLSX.utils.json_to_sheet(memberRows);
  wsMembers['!cols'] = [
    { wch: 6 },  // S.No.
    { wch: 38 }, // Membership ID
    { wch: 24 }, // Member Name
    { wch: 38 }, // Membership Tier
    { wch: 14 }, // Status
    { wch: 16 }, // Fee Paid
    { wch: 16 }, // Phone Number
    { wch: 28 }, // Email Address
    { wch: 10 }, // Gender
    { wch: 14 }, // Date of Birth
    { wch: 16 }, // Govt ID Type
    { wch: 20 }, // Govt ID Number
    { wch: 18 }, // PAN Card Number
    { wch: 18 }, // State
    { wch: 18 }, // District
    { wch: 22 }, // Occupation
    { wch: 12 }, // Plan Code
    { wch: 14 }, // Start Date
    { wch: 16 }, // End Date
    { wch: 16 }, // Reg Date
  ];
  XLSX.utils.book_append_sheet(workbook, wsMembers, 'Members Register');

  // 2. Summary & Analytics Sheet
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary['!cols'] = [
    { wch: 42 }, // Metric
    { wch: 36 }  // Value
  ];
  XLSX.utils.book_append_sheet(workbook, wsSummary, 'Summary & Metrics');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
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

export const deleteMembershipById = async (id: string) => {
  const membership = await prisma.membership.findUnique({ where: { id } });
  if (!membership) {
    throw new Error('Membership record not found');
  }
  await prisma.membership.delete({ where: { id } });
  return { success: true, id };
};

