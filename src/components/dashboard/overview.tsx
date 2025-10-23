import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useMemo } from 'react';
import type { Department } from '@/lib/types';
import { useTasks } from '@/hooks/use-tasks';

export function Overview() {
  const { tasks } = useTasks();

  const data = useMemo(() => {
    const taskCounts: Record<Department, number> = {
      Admin: 0,
      Engineering: 0,
      General: 0,
      HR: 0,
      Marketing: 0,
      Sales: 0,
    };

    tasks.forEach((task) => {
      if (task.department in taskCounts) {
        taskCounts[task.department]++;
      }
    });

    return Object.entries(taskCounts).map(([name, total]) => ({
      name,
      total,
    }));
  }, [tasks]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: any) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
