import { z } from 'zod';

export const companySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
});

export const createCompanySchema = companySchema.omit({ id: true });
export const updateCompanySchema = companySchema.partial().omit({ id: true });
