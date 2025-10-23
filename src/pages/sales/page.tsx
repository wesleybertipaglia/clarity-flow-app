import { useSales } from '@/hooks/use-sales';
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
import { useState } from 'react';
import { SaleForm } from './_components/sale-form';

export default function SalesPage() {
  const { sales } = useSales();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline">
            Sales
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all your sales records.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Sale</DialogTitle>
              <DialogDescription>
                Create a new sale record. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <SaleForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={sales} />
    </>
  );
}
