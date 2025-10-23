import { useAppointments } from '@/hooks/use-appointments';

import { useUsers } from '@/hooks/use-users';
import { format } from 'date-fns';
import type { Appointment } from '@/api/appointments/types';

export function RecentAppointments() {
  const { appointments } = useAppointments();

  const { users: employees } = useUsers();

  const recentAppointments = appointments
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )
    .slice(0, 5);

  if (recentAppointments.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">No appointments found</p>
      </div>
    );
  }

  const getParticipantNames = (appointment: Appointment) => {
    const participants: string[] = [];

    appointment.userIds.forEach((userId) => {
      const user = employees.find((u) => u.id === userId);
      if (user) participants.push(`${user.name} (Team)`);
    });

    return participants.length > 0
      ? participants.join(', ')
      : 'No participants';
  };

  return (
    <div className="space-y-8">
      {recentAppointments.map((appointment) => (
        <div className="flex items-center" key={appointment.id}>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {appointment.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {getParticipantNames(appointment)}
            </p>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">
            {format(new Date(appointment.startTime), 'MMM dd, HH:mm')}
          </div>
        </div>
      ))}
    </div>
  );
}
