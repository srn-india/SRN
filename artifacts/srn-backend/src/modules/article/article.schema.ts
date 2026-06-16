import { z } from 'zod';

export const submitArticleSchema = z.object({
  body: z.object({
    authorName: z.string().min(1, 'Author name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid 10-digit phone number is required'),
    articleCategory: z.string().min(1, 'Category is required'),
    title: z.string().min(1, 'Title is required'),
    summary: z.string().min(1, 'Summary is required'),
    content: z.string().min(1, 'Content is required'),
  }),
});
