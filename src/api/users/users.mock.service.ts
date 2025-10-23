import type { User } from './types';
import type { IUserService } from './users.interface';
import { createUserSchema, updateUserSchema } from './users.schema';
import { getItem, setItem } from '@/lib/storage';
import { hasPermission } from '@/lib/permissions';

export class UserMockService implements IUserService {
  private readonly STORAGE_KEY = 'clarityflow-users';

  getAllByCompanyId(companyId: string): User[] {
    const users = getItem(this.STORAGE_KEY, [] as User[]);
    return users.filter((user) => user.companyId === companyId);
  }

  getById(id: string): User | null {
    const users = getItem(this.STORAGE_KEY, [] as User[]);
    return users.find((user) => user.id === id) || null;
  }

  create(userId: string, employeeData?: Partial<Omit<User, 'id'>>): User {
    const validated = createUserSchema.parse(employeeData || {});
    const employees = getItem(this.STORAGE_KEY, [] as User[]);
    const newEmployee: User = {
      ...validated,
      id: userId,
    };
    employees.push(newEmployee);
    setItem(this.STORAGE_KEY, employees);
    return newEmployee;
  }

  update(
    id: string,
    updates: Partial<Omit<User, 'id'>>,
    user?: User
  ): User | null {
    if (
      user &&
      !hasPermission(
        user,
        { companyId: updates.companyId || '', resourceType: 'employees' },
        'write'
      )
    ) {
      throw new Error('Permission denied');
    }

    const employees = getItem(this.STORAGE_KEY, [] as User[]);
    const index = employees.findIndex((emp) => emp.id === id);
    if (index === -1) return null;

    const validated = updateUserSchema.parse(updates);
    employees[index] = { ...employees[index], ...validated };
    setItem(this.STORAGE_KEY, employees);
    return employees[index];
  }
}
