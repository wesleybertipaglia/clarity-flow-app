import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUsers } from '@/hooks/use-users';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { tinid } from '@wesleybertipaglia/tinid';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { User } from '@/api/users/types';
import { DialogFooter } from '@/components/ui/dialog';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  department: z.enum([
    'HR',
    'Marketing',
    'Engineering',
    'Admin',
    'Sales',
    'General',
  ]),
  role: z.enum(['Manager', 'Employee']),
});

interface EmployeeFormProps {
  employeeToEdit?: User;
  setOpen: (open: boolean) => void;
}

export function EmployeeForm({ employeeToEdit, setOpen }: EmployeeFormProps) {
  const { company } = useAuth();
  const { addUser: addEmployee, updateUser: updateEmployee } = useUsers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: employeeToEdit
      ? {
          name: employeeToEdit.name || '',
          department: employeeToEdit.department || 'General',
          role:
            employeeToEdit.role === 'Manager' ||
            employeeToEdit.role === 'Employee'
              ? employeeToEdit.role
              : 'Employee',
        }
      : {
          name: '',
          department: 'General',
          role: 'Employee',
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (employeeToEdit) {
        updateEmployee(employeeToEdit.id, values);
        toast.success('Employee updated successfully');
      } else {
        addEmployee(tinid(), {
          ...values,
          companyId: company?.id ?? '',
        });
        toast.success('Employee added successfully');
      }
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(
        `Failed to ${employeeToEdit ? 'update' : 'add'} employee: ${(error as Error).message}`
      );
    }
  }

  if (employeeToEdit?.role === 'Owner') {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Owner accounts cannot be edited through this form.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter employee name"
                    className="h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium">Email</FormLabel>
            <Input
              value={employeeToEdit?.email || ''}
              disabled
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium">Avatar URL</FormLabel>
            <Input
              value={employeeToEdit?.avatarUrl || ''}
              disabled
              className="h-10"
            />
          </div>
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Department
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      'HR',
                      'Marketing',
                      'Engineering',
                      'Admin',
                      'Sales',
                      'General',
                    ].map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['Manager', 'Employee'].map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {employeeToEdit ? 'Update Employee' : 'Add Employee'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
