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
  const pan = data.panNumber || (data.govIdType === 'PAN' ? data.govIdNumber : undefined);
  const govIdNum = data.govIdNumber || data.panNumber;
  const govIdType = data.govIdType || (data.panNumber ? 'PAN' : undefined);

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
