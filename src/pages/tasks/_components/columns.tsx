import type { ColumnDef } from '@tanstack/react-table';
import type { Task } from '@/lib/types';
import { DataTableRowActions } from './data-table-row-actions';
import { useUsers } from '@/hooks/use-users';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const AssigneeCell = ({ assigneeId }: { assigneeId: string }) => {
  const { users: employees } = useUsers();
  const assignee = employees.find((u) => u.id === assigneeId);
  if (!assignee) return <div>Unassigned</div>;

  const displayName = assignee.name || assignee.id;
  const suffix =
    assignee.role === 'Owner'
      ? '(Owner)'
      : `(${assignee.department} - ${assignee.role})`;
  return <div>{`${displayName} ${suffix}`}</div>;
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    header: 'Assignee',
    accessorKey: 'assigneeId',
    cell: ({ row }) => <AssigneeCell assigneeId={row.original.assigneeId} />,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.getValue('department')}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'outline';
      if (status === 'Done') variant = 'default';
      if (status === 'In Progress') variant = 'secondary';

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }) => {
      const dateStr = row.original.dueDate;
      let date;
      if (dateStr.includes('T')) {
        date = new Date(dateStr);
      } else {
        date = new Date(dateStr + 'T00:00:00');
      }
      return <div>{format(date, 'PP')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
