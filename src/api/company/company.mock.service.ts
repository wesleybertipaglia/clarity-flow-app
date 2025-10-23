import { tinid } from '@wesleybertipaglia/tinid';
import type { Company } from './types';
import type { ICompanyService } from './company.interface';
import { createCompanySchema, updateCompanySchema } from './company.schema';
import { getItem, setItem } from '@/lib/storage';

export class CompanyMockService implements ICompanyService {
  private readonly STORAGE_KEY = 'clarityflow-companies';

  private getCompanies(): Company[] {
    return getItem(this.STORAGE_KEY, [] as Company[]);
  }

  private setCompanies(companies: Company[]): void {
    setItem(this.STORAGE_KEY, companies);
  }

  get(id: string): Company | null {
    const companies = this.getCompanies();
    return companies.find((company) => company.id === id) || null;
  }

  getAll(): Company[] {
    return this.getCompanies();
  }

  update(id: string, companyData: Partial<Company>): Company {
    const validated = updateCompanySchema.parse(companyData);
    const companies = this.getCompanies();
    const index = companies.findIndex((company) => company.id === id);
    if (index === -1) throw new Error('Company not found');
    companies[index] = { ...companies[index], ...validated };
    this.setCompanies(companies);
    return companies[index];
  }

  create(companyData: Omit<Company, 'id'>): Company {
    const validated = createCompanySchema.parse(companyData);
    const companies = this.getCompanies();
    const newCompany: Company = {
      ...validated,
      id: tinid(),
    };
    companies.push(newCompany);
    this.setCompanies(companies);
    return newCompany;
  }
}
