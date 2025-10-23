import { z } from 'zod';

export const appointmentSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  clientIds: z.array(z.string()),
  userIds: z.array(z.string()),
  startTime: z.string(),
  endTime: z.string(),
  companyId: z.string(),
});

export const createAppointmentSchema = appointmentSchema.omit({
  id: true,
  endTime: true,
});
export const updateAppointmentSchema = appointmentSchema
  .partial()
  .omit({ id: true });
