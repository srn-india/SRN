import { z } from 'zod';

// Free text allows referrals from people who do not have an SRN account.
export const referrerSchema = z.string().trim().max(150, 'Referrer name must be at most 150 characters').nullish().transform(value => value || null);
