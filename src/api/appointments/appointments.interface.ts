import type { Appointment } from './types';
import type { User } from '@/api/users/types';

export interface IAppointmentService {
  getAppointments(companyId: string): Appointment[];
  getAppointment(id: string): Appointment | null;
  createAppointment(
    appointment: Omit<Appointment, 'id' | 'endTime'>,
    user: User
  ): Appointment;
  updateAppointment(
    id: string,
    appointment: Partial<Appointment>,
    user: User
  ): Appointment;
  deleteAppointment(id: string, user: User): void;
}
