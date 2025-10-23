import { z } from 'zod';
import { SALE_STATUSES } from '@/lib/shared-types';

export const saleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  value: z.number().min(0, 'Value must be positive'),
  status: z.enum(SALE_STATUSES),
  client: z.string().optional(),
  companyId: z.string(),
});

export const createSaleSchema = saleSchema.omit({ id: true });
export const updateSaleSchema = saleSchema.partial().omit({ id: true });
