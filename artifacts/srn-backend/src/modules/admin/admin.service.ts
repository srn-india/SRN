import { prisma } from '../../lib/prisma';
import { Role } from '@prisma/client';

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
 * Fetches platform-wide analytics
 */
export const getAnalytics = async () => {
  const [totalUsers, totalMembers, totalPosts, totalEvents, totalPayments, revenueResult] = await Promise.all([
    prisma.user.count(),
    prisma.membership.count({ where: { status: 'ACTIVE' } }),
    prisma.post.count(),
    prisma.event.count(),
    prisma.payment.count({ where: { status: 'SUCCESS' } }),
    prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalUsers,
    totalMembers,
    totalPosts,
    totalEvents,
    totalPayments,
    totalRevenue: revenueResult._sum.amount ? Number(revenueResult._sum.amount) : 0,
  };
};

