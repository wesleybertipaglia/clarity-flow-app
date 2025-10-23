import { useState, useEffect } from 'react';
import type { Company } from '@/api/company/types';
import { getCompanyService } from '@/lib/services';
import { useAuth } from './use-auth';

const companyService = getCompanyService();

export const useCompany = () => {
  const { company: authCompany } = useAuth();
  const companyId = authCompany?.id ?? '';

  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (companyId) {
      setCompany(companyService.get(companyId));
    }
  }, [companyId]);

  const updateCompany = (data: Partial<Company>) => {
    try {
      const updated = companyService.update(companyId, data);
      setCompany(updated);
      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const createCompany = (data: Omit<Company, 'id'>) => {
    try {
      const created = companyService.create(data);
      return { success: true, data: created };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  return {
    company,
    updateCompany,
    createCompany,
  };
};
