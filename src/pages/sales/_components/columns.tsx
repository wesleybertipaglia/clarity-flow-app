import type { ColumnDef } from '@tanstack/react-table';
import type { Sale } from '@/lib/types';
import { DataTableRowActions } from './data-table-row-actions';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return (
        <div className="max-w-[200px] truncate">
          {description || 'No description'}
        </div>
      );
    },
  },
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => {
      const client = row.getValue('client') as string;
      return <div>{client || 'No client'}</div>;
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => {
      const value = row.getValue('value') as number;
      return <div className="font-medium">${value.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'outline';
      if (status === 'Finished') variant = 'default';
      if (status === 'Processing') variant = 'secondary';
      if (status === 'Canceled') variant = 'destructive';

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
