import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTasks } from '@/hooks/use-tasks';
import { useUsers } from '@/hooks/use-users';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

import type { Task } from '@/lib/types';
import { DialogFooter } from '@/components/ui/dialog';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z.string().optional(),
  assigneeId: z.string().min(1, 'Please assign this task to someone.'),
  department: z.enum([
    'HR',
    'Marketing',
    'Engineering',
    'Admin',
    'Sales',
    'General',
  ]),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  dueDate: z.date(),
});

interface TaskFormProps {
  taskToEdit?: Task;
  setOpen: (open: boolean) => void;
}

export function TaskForm({ taskToEdit, setOpen }: TaskFormProps) {
  const { company } = useAuth();
  const { addTask, updateTask } = useTasks();
  const { users: employees } = useUsers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: taskToEdit
      ? {
          ...taskToEdit,
          dueDate: (() => {
            const dateStr = taskToEdit.dueDate;
            if (dateStr.includes('T')) {
              return new Date(dateStr);
            } else {
              return new Date(dateStr + 'T00:00:00');
            }
          })(),
        }
      : {
          title: '',
          description: '',
          status: 'To Do',
          department: 'General',
          dueDate: new Date(),
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const taskData = {
      ...values,
      dueDate: format(values.dueDate, 'yyyy-MM-dd'),
      companyId: company?.id ?? '',
    };

    try {
      if (taskToEdit) {
        updateTask(taskToEdit.id, taskData);
        toast.success('Task updated successfully');
      } else {
        addTask(taskData);
        toast.success('Task added successfully');
      }
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(
        `Failed to ${taskToEdit ? 'update' : 'add'} task: ${(error as Error).message}`
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
                  Task Title
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter task title"
                    className="h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Description (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter task description"
                    className="min-h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assigneeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Assignee</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select a team member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.id} (
                        {user.role === 'Owner'
                          ? 'Owner'
                          : `${user.department} - ${user.role}`}
                        )
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['To Do', 'In Progress', 'Done'].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Due Date</FormLabel>
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
            {taskToEdit ? 'Update Task' : 'Add Task'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
