import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';

import { useUsers } from '@/hooks/use-users';
import { useAppointments } from '@/hooks/use-appointments';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Appointment } from '@/api/appointments/types';
import { DEPARTMENTS } from '@/api/users/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  userIds: z.array(z.string()),
  startTime: z.date(),
});

interface AppointmentFormProps {
  appointmentToEdit?: Appointment;
  setOpen: (open: boolean) => void;
}

export function AppointmentForm({
  appointmentToEdit,
  setOpen,
}: AppointmentFormProps) {
  const { company } = useAuth();

  const { users: employees } = useUsers();
  const { addAppointment, updateAppointment } = useAppointments();

  const getDisplayMode = (selectedIds: string[]) => {
    if (!selectedIds || selectedIds.length === 0) return 'empty';
    if (selectedIds.length === 1) {
      const value = selectedIds[0];
      if (value === 'all-team') return 'all-team';
      if (value.startsWith('team-')) return value;
    }

    for (const department of DEPARTMENTS) {
      const teamEmployeeIds = employees
        .filter((emp) => emp.department === department)
        .map((emp) => emp.id)
        .sort();
      const sortedSelected = [...selectedIds].sort();

      if (
        teamEmployeeIds.length > 0 &&
        teamEmployeeIds.length === sortedSelected.length &&
        teamEmployeeIds.every((id) => sortedSelected.includes(id))
      ) {
        return `team-${department}`;
      }
    }

    if (selectedIds.length === employees.length && employees.length > 0) {
      return 'all-team';
    }

    return 'individuals';
  };

  const getActualUserIds = (selectedIds: string[]) => {
    if (!selectedIds || selectedIds.length === 0) return [];

    if (selectedIds.length === 1) {
      const value = selectedIds[0];
      if (value === 'all-team') {
        return employees.map((emp) => emp.id);
      }
      if (value.startsWith('team-')) {
        const department = value.replace('team-', '');
        return employees
          .filter((emp) => emp.department === department)
          .map((emp) => emp.id);
      }
    }

    return selectedIds;
  };

  const getInitialUserIds = () => {
    if (!appointmentToEdit?.userIds) return [];

    const displayMode = getDisplayMode(appointmentToEdit.userIds);
    if (displayMode === 'all-team') return ['all-team'];
    if (displayMode.startsWith('team-')) return [displayMode];
    return appointmentToEdit.userIds;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: appointmentToEdit?.title || '',
      userIds: getInitialUserIds(),
      startTime: appointmentToEdit
        ? new Date(appointmentToEdit.startTime)
        : new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const actualUserIds = getActualUserIds(values.userIds);

    const appointmentData = {
      title: values.title,
      clientIds: [],
      userIds: actualUserIds,
      startTime: values.startTime.toISOString(),
      companyId: company?.id ?? '',
    };

    try {
      if (appointmentToEdit) {
        updateAppointment(appointmentToEdit.id, appointmentData);
        toast.success('Appointment updated successfully');
      } else {
        addAppointment(appointmentData);
        toast.success('Appointment added successfully');
      }
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(
        `Failed to ${appointmentToEdit ? 'update' : 'add'} appointment: ${(error as Error).message}`
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Appointment Title
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter appointment title"
                    className="h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Team Members
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    if (value === 'all-team') {
                      field.onChange(['all-team']);
                    } else if (value.startsWith('team-')) {
                      field.onChange([value]);
                    } else {
                      const currentActualIds = getActualUserIds(
                        field.value || []
                      );
                      if (currentActualIds.includes(value)) {
                        field.onChange(
                          currentActualIds.filter((id) => id !== value)
                        );
                      } else {
                        field.onChange([...currentActualIds, value]);
                      }
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select team members">
                        {field.value && field.value.length > 0
                          ? (() => {
                              const displayMode = getDisplayMode(field.value);

                              if (displayMode === 'all-team') {
                                return (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    All Team
                                    <button
                                      type="button"
                                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange([]);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                );
                              } else if (displayMode.startsWith('team-')) {
                                const department = displayMode.replace(
                                  'team-',
                                  ''
                                );
                                return (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {department} Team
                                    <button
                                      type="button"
                                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange([]);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                );
                              } else {
                                const actualUserIds = getActualUserIds(
                                  field.value
                                );
                                return (
                                  <div className="flex flex-wrap gap-1">
                                    {actualUserIds.map((userId) => {
                                      const user = employees.find(
                                        (u) => u.id === userId
                                      );
                                      return user ? (
                                        <Badge
                                          key={userId}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {user.name || user.id}
                                          <button
                                            type="button"
                                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const newActualIds =
                                                actualUserIds.filter(
                                                  (id) => id !== userId
                                                );
                                              field.onChange(newActualIds);
                                            }}
                                          >
                                            <X className="h-3 w-3" />
                                          </button>
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                );
                              }
                            })()
                          : 'Select team members'}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      key="all-team"
                      value="all-team"
                      className={
                        field.value?.includes('all-team') ? 'bg-accent' : ''
                      }
                    >
                      All Team
                    </SelectItem>
                    {DEPARTMENTS.map((department) => {
                      const teamValue = `team-${department}`;
                      const isTeamSelected = field.value?.includes(teamValue);
                      const teamEmployees = employees.filter(
                        (emp) => emp.department === department
                      );
                      return (
                        <SelectItem
                          key={teamValue}
                          value={teamValue}
                          className={isTeamSelected ? 'bg-accent' : ''}
                        >
                          {department} Team ({teamEmployees.length})
                        </SelectItem>
                      );
                    })}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t">
                      Individual Users
                    </div>
                    {employees.map((user) => {
                      const actualUserIds = getActualUserIds(field.value || []);
                      const isUserSelected = actualUserIds.includes(user.id);
                      return (
                        <SelectItem
                          key={user.id}
                          value={user.id}
                          className={isUserSelected ? 'bg-accent' : ''}
                        >
                          {user.name || user.id} (
                          {user.role === 'Owner'
                            ? 'Owner'
                            : `${user.department} - ${user.role}`}
                          )
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Date & Time
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full h-10 pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
            {appointmentToEdit ? 'Update Appointment' : 'Add Appointment'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
