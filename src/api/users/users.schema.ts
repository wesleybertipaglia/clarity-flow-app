import { z } from 'zod';
import { ROLES, DEPARTMENTS } from '@/lib/shared-types';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
  companyId: z.string().optional(),
  role: z.enum(ROLES).optional(),
  department: z.enum(DEPARTMENTS).optional(),
});

export const createUserSchema = userSchema.omit({
  id: true,
});
export const updateUserSchema = userSchema.partial().omit({ id: true });
