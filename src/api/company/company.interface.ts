import type { Company } from './types';

export interface ICompanyService {
  get(id: string): Company | null;
  getAll(): Company[];
  update(id: string, company: Partial<Company>): Company;
  create(company: Omit<Company, 'id'>): Company;
}
