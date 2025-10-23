import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSales } from '@/hooks/use-sales';
import { useAuth } from '@/hooks/use-auth';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Sale } from '@/lib/types';
import { DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z.string().optional(),
  value: z.number().min(0, 'Value must be positive'),
  status: z.enum(['Pending', 'Processing', 'Finished', 'Canceled']),
  client: z.string().optional(),
});

interface SaleFormProps {
  saleToEdit?: Sale;
  setOpen: (open: boolean) => void;
}

export function SaleForm({ saleToEdit, setOpen }: SaleFormProps) {
  const { company } = useAuth();
  const { addSale, updateSale } = useSales();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: saleToEdit
      ? {
          ...saleToEdit,
        }
      : {
          title: '',
          description: '',
          value: 0,
          status: 'Pending',
          client: '',
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const saleData = {
      ...values,
      client: values.client || undefined,
      companyId: company?.id ?? '',
    };

    try {
      if (saleToEdit) {
        updateSale(saleToEdit.id, saleData);
        toast.success('Sale updated successfully');
      } else {
        addSale(saleData);
        toast.success('Sale added successfully');
        form.reset();
      }
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(
        `Failed to ${saleToEdit ? 'update' : 'add'} sale: ${(error as Error).message}`
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
                  Sale Title
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter sale title"
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
                    placeholder="Enter sale description"
                    className="min-h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Client (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter client name"
                    className="h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Value</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="Enter sale value"
                    className="h-10"
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
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
                    {['Pending', 'Processing', 'Finished', 'Canceled'].map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      )
                    )}
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
            {saleToEdit ? 'Update Sale' : 'Add Sale'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
