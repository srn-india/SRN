import { prisma } from '../../lib/prisma';
import { Role } from '@prisma/client';
import * as idcardService from '../membership/idcard.service';

/**
 * Fetches all users with pagination
 */
export const getAllUsers = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Bans or unbans a user by their ID
 */
export const toggleUserBan = async (userId: string, banStatus: boolean) => {
  // Check if user exists first for better error handling
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new Error('User not found');
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !banStatus },
    select: { id: true, firstName: true, lastName: true, isActive: true, role: true },
  });

  return user;
};

/**
 * Permanently deletes a user by their ID
 */
export const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  return await prisma.user.delete({
    where: { id: userId },
  });
};

/**
 * Updates a user's role
 */
export const updateUserRole = async (userId: string, role: Role) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  return await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, firstName: true, lastName: true, email: true, role: true },
  });
};

/**
 * Updates a user's name (firstName, lastName) and regenerates active ID card
 */
export const updateUserName = async (userId: string, firstName: string, lastName?: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: firstName.trim(),
      lastName: lastName !== undefined ? (lastName ? lastName.trim() : '') : user.lastName,
    },
    select: { id: true, firstName: true, lastName: true, email: true, role: true },
  });

  // If user has an active membership, regenerate their ID card with the updated name
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  });
  if (membership) {
    try {
      await idcardService.generateAndUploadIdCard(membership.id);
    } catch (err) {
      console.error('Failed to regenerate ID card after name update:', err);
    }
  }

  return updatedUser;
};

/**
 * Fetches platform-wide analytics including both Razorpay and Manual (UPI/Bank Transfer) payments
 */
export const getAnalytics = async () => {
  const [
    totalUsers,
    totalMembers,
    totalPosts,
    totalEvents,
    razorpaySuccessCount,
    manualApprovedCount,
    razorpayMembershipRevenue,
    razorpayDonationRevenue,
    manualMembershipRevenue,
    manualDonationRevenue
  ] = await Promise.all([
    prisma.user.count(),
    prisma.membership.count({ where: { status: 'ACTIVE' } }),
    prisma.post.count(),
    prisma.event.count(),
    prisma.payment.count({ where: { status: 'SUCCESS' } }),
    prisma.manualPayment.count({ where: { status: 'APPROVED' } }),
    // Razorpay Online Payments
    prisma.payment.aggregate({
      where: { status: 'SUCCESS', type: 'MEMBERSHIP' },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: 'SUCCESS', type: 'DONATION' },
      _sum: { amount: true },
    }),
    // Manual Payments (UPI, QR & Bank Transfer)
    prisma.manualPayment.aggregate({
      where: { status: 'APPROVED', type: 'MEMBERSHIP' },
      _sum: { amount: true },
    }),
    prisma.manualPayment.aggregate({
      where: { status: 'APPROVED', type: 'DONATION' },
      _sum: { amount: true },
    }),
  ]);

  const membershipRevenue = Number(razorpayMembershipRevenue._sum.amount || 0) + Number(manualMembershipRevenue._sum.amount || 0);
  const donationRevenue = Number(razorpayDonationRevenue._sum.amount || 0) + Number(manualDonationRevenue._sum.amount || 0);
  const totalRevenue = membershipRevenue + donationRevenue;
  const totalPayments = razorpaySuccessCount + manualApprovedCount;

  return {
    totalUsers,
    totalMembers,
    totalPosts,
    totalEvents,
    totalPayments,
    totalRevenue,
    membershipRevenue,
    donationRevenue,
  };
};

/**
 * Resets platform collections data (clears recorded payments and donations)
 */
export const resetCollections = async () => {
  const [paymentsDeleted, manualDeleted, donationRecordsDeleted, donationsDeleted] = await Promise.all([
    prisma.payment.deleteMany(),
    prisma.manualPayment.deleteMany(),
    prisma.donationRecord.deleteMany(),
    prisma.donation.deleteMany(),
  ]);

  return {
    paymentsDeleted: paymentsDeleted.count,
    manualDeleted: manualDeleted.count,
    donationRecordsDeleted: donationRecordsDeleted.count,
    donationsDeleted: donationsDeleted.count,
  };
};


