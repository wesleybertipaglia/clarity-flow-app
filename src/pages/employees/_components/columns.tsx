import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/api/users/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'avatarUrl',
    header: '',
    cell: ({ row }) => {
      const avatarUrl = row.getValue('avatarUrl') as string;
      const name = row.getValue('name') as string;
      const initials = name
        ? name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : 'N/A';
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} alt={name || 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue('id')}</div>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('name') || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.getValue('department')}</Badge>;
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'outline';
      if (role === 'Owner') variant = 'default';
      if (role === 'Manager') variant = 'secondary';
      return <Badge variant={variant}>{role}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
