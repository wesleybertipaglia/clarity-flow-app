import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useAppointments } from '@/hooks/use-appointments';
import { useTasks } from '@/hooks/use-tasks';
import { useSales } from '@/hooks/use-sales';
import { Calendar, CheckSquare, DollarSign } from 'lucide-react';

import { RecentTasks } from '@/components/dashboard/recent-tasks';
import { RecentAppointments } from '@/components/dashboard/recent-appointments';
import { RecentSales } from '@/components/dashboard/recent-sales';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const { tasks } = useTasks();
  const { sales } = useSales();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          {isMounted && user ? (
            `Welcome back, ${user.name.split(' ')[0]}!`
          ) : (
            <Skeleton className="h-8 w-48" />
          )}
        </h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled in the next 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Tasks
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter((t) => t.status !== 'Done').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Tasks currently in progress or to do
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {sales
                  .reduce((total, sale) => total + sale.value, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {sales.length} sales total
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentTasks />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                Recent Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentAppointments />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
