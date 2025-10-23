import type { Appointment } from './types';
import type { User } from '@/api/users/types';
import { tinid } from '@wesleybertipaglia/tinid';
import type { IAppointmentService } from './appointments.interface';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from './appointments.schema';
import { getItem, setItem } from '@/lib/storage';
import { hasPermission } from '@/lib/permissions';

export class AppointmentMockService implements IAppointmentService {
  private readonly STORAGE_KEY = 'clarityflow-appointments';

  getAppointments(companyId: string): Appointment[] {
    const appointments = getItem(this.STORAGE_KEY, [] as Appointment[]);
    return appointments.filter(
      (appointment) => appointment.companyId === companyId
    );
  }

  getAppointment(id: string): Appointment | null {
    const appointments = getItem(this.STORAGE_KEY, [] as Appointment[]);
    return appointments.find((appointment) => appointment.id === id) || null;
  }

  createAppointment(
    appointmentData: Omit<Appointment, 'id' | 'endTime'>,
    user: User
  ): Appointment {
    if (
      !hasPermission(
        user,
        { companyId: appointmentData.companyId, resourceType: 'appointments' },
        'write'
      )
    ) {
      throw new Error('Permission denied');
    }
    const validated = createAppointmentSchema.parse(appointmentData);
    const appointments = getItem(this.STORAGE_KEY, [] as Appointment[]);
    const newAppointment: Appointment = {
      ...validated,
      id: tinid(),
      endTime: new Date(
        new Date(validated.startTime).getTime() + 60 * 60 * 1000
      ).toISOString(),
    };
    appointments.push(newAppointment);
    setItem(this.STORAGE_KEY, appointments);
    return newAppointment;
  }

  updateAppointment(
    id: string,
    appointmentData: Partial<Appointment>,
    user: User
  ): Appointment {
    const appointments = getItem(this.STORAGE_KEY, [] as Appointment[]);
    const index = appointments.findIndex(
      (appointment) => appointment.id === id
    );
    if (index === -1) throw new Error('Appointment not found');
    const appointment = appointments[index];
    if (
      !hasPermission(
        user,
        { companyId: appointment.companyId, resourceType: 'appointments' },
        'write'
      )
    ) {
      throw new Error('Permission denied');
    }
    const validated = updateAppointmentSchema.parse(appointmentData);
    appointments[index] = { ...appointments[index], ...validated };
    setItem(this.STORAGE_KEY, appointments);
    return appointments[index];
  }

  deleteAppointment(id: string, user: User): void {
    const appointments = getItem(this.STORAGE_KEY, [] as Appointment[]);
    const appointment = appointments.find((a) => a.id === id);
    if (!appointment) throw new Error('Appointment not found');
    if (
      !hasPermission(
        user,
        { companyId: appointment.companyId, resourceType: 'appointments' },
        'write'
      )
    ) {
      throw new Error('Permission denied');
    }
    const filtered = appointments.filter(
      (appointment) => appointment.id !== id
    );
    setItem(this.STORAGE_KEY, filtered);
  }
}
