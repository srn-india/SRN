import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export const createApplication = async (data: Prisma.PostApplicationUncheckedCreateInput) => {
  return prisma.postApplication.create({
    data,
  });
};

export const getAllApplications = async () => {
  return prisma.postApplication.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getMyApplication = async (userId: string) => {
  return prisma.postApplication.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

export const getApplicationById = async (id: string) => {
  return prisma.postApplication.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        }
      }
    }
  });
};

export const updateApplicationStatus = async (id: string, status: string) => {
  return prisma.postApplication.update({
    where: { id },
    data: { status },
  });
};

export const deleteApplication = async (id: string) => {
  return prisma.postApplication.delete({
    where: { id },
  });
};
