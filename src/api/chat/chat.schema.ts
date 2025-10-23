import { z } from 'zod';

export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'model']),
  text: z.string().min(1, 'Message text is required'),
  timestamp: z.date(),
});

export const createMessageSchema = messageSchema.omit({
  id: true,
  timestamp: true,
});
