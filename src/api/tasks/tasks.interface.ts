import type { Task } from './types';
import type { User } from '@/api/users/types';

export interface ITaskService {
  getAll(companyId: string): Task[];
  getById(id: string): Task | null;
  create(task: Omit<Task, 'id'>, user: User): Task;
  update(id: string, task: Partial<Task>, user: User): Task;
  delete(id: string, user: User): void;
}
