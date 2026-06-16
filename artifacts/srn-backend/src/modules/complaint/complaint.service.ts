import { prisma } from '../../lib/prisma';

export const createComplaint = async (userId: string, data: any) => {
  return await prisma.complaint.create({
    data: {
      ...data,
      userId,
      ticket: `SRN-GRI-${Math.floor(100000 + Math.random() * 900000)}`,
    },
  });
};

export const getComplaints = async () => {
  return await prisma.complaint.findMany({
    orderBy: { createdAt: 'desc' },
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

export const getComplaintsByUser = async (userId: string) => {
  return await prisma.complaint.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getComplaintById = async (id: string) => {
  return await prisma.complaint.findUnique({
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

export const updateComplaintStatus = async (id: string, status: string) => {
  return await prisma.complaint.update({
    where: { id },
    data: { status },
  });
};

export const deleteComplaint = async (id: string) => {
  return await prisma.complaint.delete({
    where: { id },
  });
};

export const getPublishedComplaints = async () => {
  return await prisma.complaint.findMany({
    where: {
      isPublished: true,
      status: 'Solved',
    },
    orderBy: { updatedAt: 'desc' },
  });
};

export const publishComplaint = async (id: string, data: any) => {
  const { isPublished, titleEn, titleHi, resolutionEn, resolutionHi } = data;
  return await prisma.complaint.update({
    where: { id },
    data: {
      isPublished,
      titleEn,
      titleHi,
      resolutionEn,
      resolutionHi,
      status: isPublished ? 'Solved' : undefined,
    },
  });
};
