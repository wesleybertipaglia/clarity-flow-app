import type { User } from './types';

export interface IUserService {
  getAllByCompanyId(companyId: string): User[];
  getById(id: string): User | null;
  create(userId: string, employee?: Partial<Omit<User, 'id'>>): User;
  update(
    id: string,
    updates: Partial<Omit<User, 'id'>>,
    user?: User
  ): User | null;
}
