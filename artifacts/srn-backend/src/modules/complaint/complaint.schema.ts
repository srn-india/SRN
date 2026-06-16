import { z } from 'zod';

export const createComplaintSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    state: z.string().min(1, 'State is required'),
    category: z.string().min(1, 'Category is required'),
    subject: z.string().min(1, 'Subject is required'),
    description: z.string().min(1, 'Description is required'),
  })
});

export const updateComplaintStatusSchema = z.object({
  body: z.object({
    status: z.enum(['Pending', 'Solved']),
  })
});

export const publishComplaintSchema = z.object({
  body: z.object({
    isPublished: z.boolean(),
    titleEn: z.string().nullable().optional(),
    titleHi: z.string().nullable().optional(),
    resolutionEn: z.string().nullable().optional(),
    resolutionHi: z.string().nullable().optional(),
  })
});
