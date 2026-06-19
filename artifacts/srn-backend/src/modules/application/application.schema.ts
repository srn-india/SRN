import { z } from 'zod';

export const createApplicationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  dob: z.string().min(1, 'Date of birth is required').transform((val) => new Date(val)),
  gender: z.string().min(1, 'Gender is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(1, 'Address is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  appliedPosition: z.string().min(1, 'Applied position is required'),
  currentOccupation: z.string().optional(),
  socialContribution: z.string().min(1, 'Social contribution is required'),
  whyJoin: z.string().min(1, 'Reason to join is required'),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED'])
});
