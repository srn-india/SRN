import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      state: true,
      district: true,
      gender: true,
      dateOfBirth: true,
      govIdType: true,
      govIdNumber: true,
      panNumber: true,
      avatar: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!user) throw new Error('User not found');
  return user;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const pan = data.panNumber ? String(data.panNumber).trim() : (data.govIdType === 'PAN' && data.govIdNumber ? String(data.govIdNumber).trim() : undefined);
  const govIdNum = data.govIdNumber ? String(data.govIdNumber).trim() : (data.panNumber ? String(data.panNumber).trim() : undefined);
  const govIdType = data.govIdType || (data.panNumber ? 'PAN' : undefined);
  const phone = data.phone ? String(data.phone).trim() : undefined;

  if (phone) {
    const existingPhone = await prisma.user.findFirst({
      where: { phone, id: { not: userId } }
    });
    if (existingPhone) {
      throw new Error('This phone number is already registered with another account');
    }
  }

  if (govIdNum) {
    const existingGov = await prisma.user.findFirst({
      where: { govIdNumber: govIdNum, id: { not: userId } }
    });
    if (existingGov) {
      throw new Error('This Government ID number is already registered with another account');
    }
  }

  if (pan) {
    const existingPan = await prisma.user.findFirst({
      where: { panNumber: pan, id: { not: userId } }
    });
    if (existingPan) {
      throw new Error('This PAN card number is already registered with another account');
    }
  }

  return await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      state: data.state,
      district: data.district,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      govIdType: govIdType || undefined,
      govIdNumber: govIdNum || undefined,
      panNumber: pan || undefined,
      avatar: data.avatar,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      govIdType: true,
      govIdNumber: true,
      panNumber: true,
      avatar: true,
      role: true,
    },
  });
};


export const changePassword = async (userId: string, data: any) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password) throw new Error('User not found');

  const isMatch = await bcrypt.compare(data.currentPassword, user.password);
  if (!isMatch) throw new Error('Current password is incorrect');

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Password changed successfully' };
};
