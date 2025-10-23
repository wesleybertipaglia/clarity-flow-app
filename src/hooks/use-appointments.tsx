import { useState, useEffect } from 'react';
import type { Appointment } from '@/api/appointments/types';
import { getAppointmentsService } from '@/lib/services';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

const appointmentService = getAppointmentsService();

export const useAppointments = () => {
  const { userData, company } = useAuth();
  const companyId = company?.id ?? '';

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (companyId) {
      setAppointments(appointmentService.getAppointments(companyId));
    }
  }, [companyId]);

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'endTime'>) => {
    try {
      if (!userData) throw new Error('User not authenticated');
      const newAppointment = appointmentService.createAppointment(
        appointment,
        userData
      );
      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error adding appointment:', error);
      toast.error('Failed to add appointment', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    try {
      if (!userData) throw new Error('User not authenticated');
      const updated = appointmentService.updateAppointment(id, data, userData);
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? updated : appointment
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error updating appointment:', error);
      toast.error('Failed to update appointment', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const deleteAppointment = (id: string) => {
    try {
      if (!userData) throw new Error('User not authenticated');
      appointmentService.deleteAppointment(id, userData);
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error deleting appointment:', error);
      toast.error('Failed to delete appointment', {
        description: errorMessage,
      });
      throw error;
    }
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };
};
