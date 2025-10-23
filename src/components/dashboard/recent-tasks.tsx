import { useTasks } from '@/hooks/use-tasks';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export function RecentTasks() {
  const { tasks } = useTasks();

  const recentTasks = tasks.slice(0, 5);

  if (recentTasks.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {recentTasks.map((task) => (
        <div className="flex items-center" key={task.id}>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{task.title}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {task.status}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Due:{' '}
                {(() => {
                  const dateStr = task.dueDate;
                  let date;
                  if (dateStr.includes('T')) {
                    date = new Date(dateStr);
                  } else {
                    date = new Date(dateStr + 'T00:00:00');
                  }
                  return format(date, 'MMM dd');
                })()}
              </p>
            </div>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">
            {task.department}
          </div>
        </div>
      ))}
    </div>
  );
}
