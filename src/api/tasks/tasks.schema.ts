import { z } from 'zod';
import { TASK_STATUSES, DEPARTMENTS } from '@/lib/shared-types';

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES),
  dueDate: z.string(),
  assigneeId: z.string(),
  department: z.enum(DEPARTMENTS),
  companyId: z.string(),
});

export const createTaskSchema = taskSchema.omit({ id: true });
export const updateTaskSchema = taskSchema.partial().omit({ id: true });
