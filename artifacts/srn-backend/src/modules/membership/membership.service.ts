import { prisma } from '../../lib/prisma';
import { generateAndUploadIdCard } from './idcard.service';
import { sendMembershipEmail } from '../../utils/email';

export const subscribeUser = async (userId: string, plan: string, durationInMonths: number, txClient?: any) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationInMonths);

  const client = txClient || prisma;

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

  // 2. Update user role to MEMBER
  await client.user.update({
    where: { id: userId },
    data: { role: 'MEMBER' },
  });

  // 3. Asynchronously generate and upload the ID card
  generateAndUploadIdCard(membership.id)
    .then(async (url) => {
      if (url) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          await sendMembershipEmail(user.email, user.firstName, url);
        }
      }
    })
    .catch(console.error);

  return membership;
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
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.membership.count(),
  ]);

  return {
    memberships,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
