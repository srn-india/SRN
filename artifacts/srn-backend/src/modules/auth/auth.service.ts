import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/cache';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { sendEmail } from '../../utils/email.service';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';

export const registerUser = async (data: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      state: data.state,
      district: data.district,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      otpCode,
      otpExpires,
      isVerified: false,
    },
  });

  // Since we created utils/email.ts, we should import sendOTPEmail at the top, but we'll just require it dynamically here to avoid import issues for now, or assume it's imported.
  // Actually, I'll import it at the top in a separate chunk.
  const { sendOTPEmail } = require('../../utils/email');
  await sendOTPEmail(user.email, otpCode);

  return { user, requiresOtp: true };
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.password) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.isVerified) {
    // Generate new OTP if logging in unverified
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode, otpExpires }
    });

    const { sendOTPEmail } = require('../../utils/email');
    await sendOTPEmail(user.email, otpCode);

    return { user, requiresOtp: true };
  }

  if (user.isTwoFactorEnabled) {
    const tempAuthToken = jwt.sign(
      { id: user.id, role: user.role, type: '2FA_TEMP' },
      process.env.JWT_ACCESS_SECRET || 'fallback_secret',
      { expiresIn: '5m' }
    );
    return { user, requires2FA: true, tempAuthToken };
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

  return { user, accessToken, refreshToken };
};

export const verifyOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.isVerified) {
    throw new Error('User is already verified');
  }

  if (user.otpCode !== otp) {
    throw new Error('Invalid OTP');
  }

  if (!user.otpExpires || user.otpExpires < new Date()) {
    throw new Error('OTP has expired');
  }

  const verifiedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      otpCode: null,
      otpExpires: null
    }
  });

  const accessToken = generateAccessToken({ id: verifiedUser.id, role: verifiedUser.role });
  const refreshToken = generateRefreshToken({ id: verifiedUser.id, role: verifiedUser.role });

  return { user: verifiedUser, accessToken, refreshToken };
};

export const handleGoogleOAuth = async (profile: any) => {
  let user = await prisma.user.findUnique({
    where: { email: profile.email },
  });

  if (!user) {
    const nameParts = profile.name ? profile.name.split(' ') : [''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    user = await prisma.user.create({
      data: {
        email: profile.email,
        firstName,
        lastName,
        provider: 'GOOGLE',
        isVerified: true,
      },
    });
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

  return { user, accessToken, refreshToken };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Store hashed token in Redis for 1 hour
  await redis.set(`resetToken:${hashedToken}`, user.id, 'EX', 3600);

  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
  const message = `
    <h1>Password Reset Request</h1>
    <p>Please click the link below to reset your password. This link is valid for 1 hour.</p>
    <a href="${resetUrl}">${resetUrl}</a>
  `;

  await sendEmail(user.email, 'Password Reset Request', message);
  return { message: 'Password reset link sent to email' };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const userId = await redis.get(`resetToken:${hashedToken}`);

  if (!userId) throw new Error('Invalid or expired reset token');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  await redis.del(`resetToken:${hashedToken}`);
  return { message: 'Password reset successful' };
};

export const sendVerificationEmail = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  if (user.isVerified) throw new Error('User is already verified');

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  // Store hashed token in Redis for 24 hours
  await redis.set(`verifyEmail:${hashedToken}`, user.id, 'EX', 86400);

  const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
  const message = `
    <h1>Email Verification</h1>
    <p>Please click the link below to verify your email address.</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
  `;

  await sendEmail(user.email, 'Verify your email address', message);
  return { message: 'Verification email sent' };
};

export const verifyEmail = async (token: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const userId = await redis.get(`verifyEmail:${hashedToken}`);

  if (!userId) throw new Error('Invalid or expired verification token');

  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });

  await redis.del(`verifyEmail:${hashedToken}`);
  return { message: 'Email verified successfully' };
};

export const setup2FA = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const secret = authenticator.generateSecret();
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret }
  });

  const otpauthUrl = authenticator.keyuri(user.email, 'SRN Admin', secret);
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

  return { secret, qrCodeUrl };
};

export const verifyAndEnable2FA = async (userId: string, token: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorSecret) throw new Error('2FA not set up');

  const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
  if (!isValid) throw new Error('Invalid 2FA token');

  await prisma.user.update({
    where: { id: userId },
    data: { isTwoFactorEnabled: true }
  });

  return { message: '2FA successfully enabled' };
};

export const verify2FALogin = async (tempToken: string, token: string) => {
  let decoded: any;
  try {
    decoded = jwt.verify(tempToken, process.env.JWT_ACCESS_SECRET || 'fallback_secret');
  } catch (err) {
    throw new Error('Invalid or expired temporary token');
  }

  if (decoded.type !== '2FA_TEMP') {
    throw new Error('Invalid token type');
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user || !user.twoFactorSecret || !user.isTwoFactorEnabled) {
    throw new Error('2FA is not enabled for this user');
  }

  const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
  if (!isValid) throw new Error('Invalid 2FA token');

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

  return { user, accessToken, refreshToken };
};
