import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    state: z.string().min(2, 'State is required').optional(),
    district: z.string().min(2, 'District is required').optional(),
    gender: z.string().min(1, 'Gender is required').optional(),
    dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    avatar: z.string().url('Must be a valid URL').optional(),
    profilePicture: z.string().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});
