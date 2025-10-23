import type { ColumnDef } from '@tanstack/react-table';
import type { Appointment } from '@/lib/types';
import { DataTableRowActions } from './data-table-row-actions';
import { format } from 'date-fns';

import { useUsers } from '@/hooks/use-users';

const ParticipantsCell = ({ userIds }: { userIds: string[] }) => {
  const { users: employees } = useUsers();

  const participants: string[] = [];

  userIds.forEach((userId) => {
    const user = employees.find((u) => u.id === userId);
    if (user) {
      const displayName = user.name || user.id;
      const suffix =
        user.role === 'Owner'
          ? '(Owner)'
          : `(${user.department} - ${user.role})`;
      participants.push(`${displayName} ${suffix}`);
    }
  });

  return (
    <div
      className="text-sm max-w-[200px] truncate"
      title={participants.join(', ') || 'No participants'}
    >
      {participants.join(', ') || 'No participants'}
    </div>
  );
};

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'participants',
    header: 'Participants',
    cell: ({ row }) => <ParticipantsCell userIds={row.original.userIds} />,
    size: 200,
    maxSize: 200,
  },
  {
    accessorKey: 'startTime',
    header: 'Date',
    cell: ({ row }) => {
      return <div>{format(new Date(row.original.startTime), 'PP')}</div>;
    },
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => {
      return <div>{format(new Date(row.original.startTime), 'p')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
