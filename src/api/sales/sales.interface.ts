import type { Sale } from './types';
import type { User } from '@/api/users/types';

export interface ISaleService {
  getAll(companyId: string): Sale[];
  getById(id: string): Sale | null;
  create(sale: Omit<Sale, 'id'>, user: User): Sale;
  update(id: string, sale: Partial<Sale>, user: User): Sale;
  delete(id: string, user: User): void;
}
