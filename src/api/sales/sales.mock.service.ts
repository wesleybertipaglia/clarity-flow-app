import type { Sale } from './types';
import type { User } from '@/api/users/types';
import { tinid } from '@wesleybertipaglia/tinid';
import type { ISaleService } from './sales.interface';
import { createSaleSchema, updateSaleSchema } from './sales.schema';
import { getItem, setItem } from '@/lib/storage';
import { hasPermission } from '@/lib/permissions';

export class SaleMockService implements ISaleService {
  private readonly STORAGE_KEY = 'clarityflow-sales';

  getAll(companyId: string): Sale[] {
    const sales = getItem(this.STORAGE_KEY, [] as Sale[]);
    return sales.filter((sale) => sale.companyId === companyId);
  }

  getById(id: string): Sale | null {
    const sales = getItem(this.STORAGE_KEY, [] as Sale[]);
    return sales.find((sale) => sale.id === id) || null;
  }

  create(saleData: Omit<Sale, 'id'>, user: User): Sale {
    if (
      !hasPermission(
        user,
        { companyId: saleData.companyId, resourceType: 'sales' },
        'write'
      )
    ) {
      throw new Error('Permission denied');
    }

    const validated = createSaleSchema.parse(saleData);
    const sales = getItem(this.STORAGE_KEY, [] as Sale[]);
    const newSale: Sale = {
      ...validated,
      id: tinid(),
    };
    sales.push(newSale);
    setItem(this.STORAGE_KEY, sales);

    return newSale;
  }

  update(id: string, saleData: Partial<Sale>, user: User): Sale {
    const sales = getItem(this.STORAGE_KEY, [] as Sale[]);
    const index = sales.findIndex((sale) => sale.id === id);
    if (index === -1) throw new Error('Sale not found');
    const sale = sales[index];
    if (
      !hasPermission(
        user,
        { companyId: sale.companyId, resourceType: 'sales' },
        'write'
      )
    ) {
      throw new Error('Permission denied');
    }
    const validated = updateSaleSchema.parse(saleData);
    sales[index] = { ...sales[index], ...validated };
    setItem(this.STORAGE_KEY, sales);
    return sales[index];
  }

  delete(id: string, user: User): void {
    const sales = getItem(this.STORAGE_KEY, [] as Sale[]);
    const sale = sales.find((s) => s.id === id);
    if (!sale) throw new Error('Sale not found');
    if (
      !hasPermission(
        user,
        { companyId: sale.companyId, resourceType: 'sales' },
        'write'
      )
    ) {
      throw new Error('Permission denied');
    }
    const filtered = sales.filter((sale) => sale.id !== id);
    setItem(this.STORAGE_KEY, filtered);
  }
}
