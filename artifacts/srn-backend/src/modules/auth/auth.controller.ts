import { Request, Response } from 'express';
import * as authService from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendError } from '../../utils/response';
import { OAuth2Client } from 'google-auth-library';
import { redis } from '../../lib/cache';

export const register = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    if ('requiresOtp' in result) {
      return sendSuccess(res, {
        requiresOtp: true,
        email: result.user.email
      }, 'OTP sent to email', 200);
    }
    
    // In case registration bypasses OTP in the future
    const accessToken = (result as any).accessToken;
    const refreshToken = (result as any).refreshToken;

    if (accessToken && refreshToken) {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }

    sendSuccess(res, {
      user: { 
        id: (result as any).user.id, 
        firstName: (result as any).user.firstName, 
        lastName: (result as any).user.lastName, 
        email: (result as any).user.email, 
        role: (result as any).user.role,
        phone: (result as any).user.phone,
        state: (result as any).user.state,
        district: (result as any).user.district,
        gender: (result as any).user.gender,
        profilePicture: (result as any).user.avatar
      },
      accessToken: accessToken
    }, 'Registration successful', 201);
  } catch (error: any) {
    sendError(res, error.message, null, 400);
  }
});

export const login = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    if ('requiresOtp' in result) {
      return sendSuccess(res, {
        requiresOtp: true,
        email: result.user.email
      }, 'Account not verified. OTP sent to email', 200);
    }
    if ('requires2FA' in result) {
      return sendSuccess(res, {
        requires2FA: true,
        tempAuthToken: result.tempAuthToken
      }, '2FA token required', 200);
    }

    const accessToken = (result as any).accessToken;
    const refreshToken = (result as any).refreshToken;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccess(res, {
      user: { 
        id: (result as any).user.id, 
        firstName: (result as any).user.firstName, 
        lastName: (result as any).user.lastName, 
        email: (result as any).user.email, 
        role: (result as any).user.role,
        phone: (result as any).user.phone,
        state: (result as any).user.state,
        district: (result as any).user.district,
        gender: (result as any).user.gender,
        profilePicture: (result as any).user.avatar
      },
      accessToken: accessToken
    }, 'Login successful');
  } catch (error: any) {
    sendError(res, error.message, null, 401);
  }
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
  
  if (token) {
    // Blacklist the token for 15 minutes (standard expiry)
    await redis.set(`blacklist:${token}`, 'true', 'EX', 15 * 60);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  sendSuccess(res, null, 'Logged out successfully');
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = { ...req.user, profilePicture: req.user.avatar };
  delete user.password;
  delete user.avatar;
  sendSuccess(res, { user }, 'User profile retrieved successfully');
});

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

export const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });
  res.redirect(url);
});

export const googleCallback = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.query;
  const { tokens } = await client.getToken(code as string);
  client.setCredentials(tokens);

  const userinfo = await client.request({
    url: 'https://www.googleapis.com/oauth2/v3/userinfo',
  });

  const profile: any = userinfo.data;
  
  const result = await authService.handleGoogleOAuth({
    email: profile.email,
    name: profile.name,
    avatar: profile.picture,
  });

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${result.accessToken}`);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  sendSuccess(res, result, 'Reset link sent to email');
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword(token, password);
  sendSuccess(res, result, 'Password reset successful');
});

export const sendVerification = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.sendVerificationEmail(req.user.id);
  sendSuccess(res, result, 'Verification email sent');
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;
  const result = await authService.verifyEmail(token as string);
  sendSuccess(res, result, 'Email verified successfully');
});

export const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return sendError(res, 'Email and OTP are required', null, 400);
  }

  const result = await authService.verifyOtp(email, otp);

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  sendSuccess(res, {
    user: { 
      id: result.user.id, 
      firstName: result.user.firstName, 
      lastName: result.user.lastName, 
      email: result.user.email, 
      role: result.user.role,
      phone: result.user.phone,
      state: result.user.state,
      district: result.user.district,
      gender: result.user.gender,
      profilePicture: result.user.avatar
    },
    accessToken: result.accessToken
  }, 'Email verified and logged in successfully');
});

export const setup2FA = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.setup2FA(req.user.id);
  sendSuccess(res, result, '2FA setup initiated');
});

export const enable2FA = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return sendError(res, '2FA token is required', null, 400);

  const result = await authService.verifyAndEnable2FA(req.user.id, token);
  sendSuccess(res, result, '2FA successfully enabled');
});

export const verify2FALogin = catchAsync(async (req: Request, res: Response) => {
  const { tempAuthToken, totpToken } = req.body;
  if (!tempAuthToken || !totpToken) {
    return sendError(res, 'Temporary token and 2FA token are required', null, 400);
  }

  const result = await authService.verify2FALogin(tempAuthToken, totpToken);

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  sendSuccess(res, {
    user: { 
      id: result.user.id, 
      firstName: result.user.firstName, 
      lastName: result.user.lastName, 
      email: result.user.email, 
      role: result.user.role,
      phone: result.user.phone,
      state: result.user.state,
      district: result.user.district,
      gender: result.user.gender,
      profilePicture: result.user.avatar
    },
    accessToken: result.accessToken
  }, '2FA verified and login successful');
});
