import { useUsers } from '@/hooks/use-users';
import { columns } from './_components/columns';
import { DataTable } from '@/components/data-table/data-table';
import { useMemo } from 'react';

export default function EmployeesPage() {
  const { users: employees } = useUsers();
  const tableKey = useMemo(() => 'employees-table', []);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline">
            Employees
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all employees in your company.
          </p>
        </div>
      </div>
      <DataTable key={tableKey} columns={columns} data={employees} />
    </>
  );
}
