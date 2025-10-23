import type { Role, Department } from '@/lib/shared-types';

export {
  type Role,
  type Department,
  ROLES,
  DEPARTMENTS,
} from '@/lib/shared-types';

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  companyId?: string;
  role?: Role;
  department?: Department;
}
