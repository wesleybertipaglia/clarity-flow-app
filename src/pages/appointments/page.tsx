import { useAppointments } from '@/hooks/use-appointments';
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
import { AppointmentForm } from './_components/appointment-form';

export default function AppointmentsPage() {
  const { appointments } = useAppointments();
  const [open, setOpen] = useState(false);
  const tableKey = useMemo(() => 'appointments-table', []);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline">
            Appointments
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all appointments.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Appointment</DialogTitle>
              <DialogDescription>
                Schedule a new appointment. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <AppointmentForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable key={tableKey} columns={columns} data={appointments} />
    </>
  );
}
