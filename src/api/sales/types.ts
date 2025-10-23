import type { SaleStatus } from '@/lib/shared-types';

export { type SaleStatus, SALE_STATUSES } from '@/lib/shared-types';

export interface Sale {
  id: string;
  title: string;
  description?: string;
  value: number;
  status: SaleStatus;
  client?: string;
  companyId: string;
}
