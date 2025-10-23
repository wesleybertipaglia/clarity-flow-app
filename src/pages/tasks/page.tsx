import { useTasks } from '@/hooks/use-tasks';
import { columns } from './_components/columns';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMemo, useState } from 'react';
import { TaskForm } from './_components/task-form';

export default function TasksPage() {
  const { tasks } = useTasks();
  const [open, setOpen] = useState(false);
  const tableKey = useMemo(() => 'tasks-table', []);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline">
            Tasks
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all your team&apos;s tasks.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
              <DialogDescription>
                Create a new task for your team. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <TaskForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable key={tableKey} columns={columns} data={tasks} />
    </>
  );
}
