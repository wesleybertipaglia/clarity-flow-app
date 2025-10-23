import { useState, useEffect } from 'react';
import type { Sale } from '@/api/sales/types';
import { getSalesService } from '@/lib/services';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

const saleService = getSalesService();

export const useSales = () => {
  const { userData, company } = useAuth();
  const companyId = company?.id ?? '';

  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    if (companyId) {
      setSales(saleService.getAll(companyId));
    }
  }, [companyId]);

  const addSale = (sale: Omit<Sale, 'id'>) => {
    try {
      if (!userData) throw new Error('User not authenticated');
      const newSale = saleService.create(sale, userData);
      setSales((prev) => [...prev, newSale]);
      return newSale;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error adding sale:', error);
      toast.error('Failed to add sale', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const updateSale = (id: string, data: Partial<Sale>) => {
    try {
      if (!userData) throw new Error('User not authenticated');
      const updated = saleService.update(id, data, userData);
      setSales((prev) => prev.map((sale) => (sale.id === id ? updated : sale)));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error updating sale:', error);
      toast.error('Failed to update sale', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const deleteSale = (id: string) => {
    try {
      if (!userData) throw new Error('User not authenticated');
      saleService.delete(id, userData);
      setSales((prev) => prev.filter((sale) => sale.id !== id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error deleting sale:', error);
      toast.error('Failed to delete sale', {
        description: errorMessage,
      });
      throw error;
    }
  };

  return {
    sales,
    addSale,
    updateSale,
    deleteSale,
  };
};
