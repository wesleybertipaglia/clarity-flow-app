import type { Task } from './types';
import type { User } from '@/api/users/types';
import { tinid } from '@wesleybertipaglia/tinid';
import type { ITaskService } from './tasks.interface';
import { createTaskSchema, updateTaskSchema } from './tasks.schema';
import { getItem, setItem } from '@/lib/storage';
import { hasPermission } from '@/lib/permissions';

export class TaskMockService implements ITaskService {
  private readonly STORAGE_KEY = 'clarityflow-tasks';

  getAll(companyId: string): Task[] {
    const tasks = getItem(this.STORAGE_KEY, [] as Task[]);
    return tasks.filter((task) => task.companyId === companyId);
  }

  getById(id: string): Task | null {
    const tasks = getItem(this.STORAGE_KEY, [] as Task[]);
    return tasks.find((task) => task.id === id) || null;
  }

  create(taskData: Omit<Task, 'id'>, user: User): Task {
    if (
      !hasPermission(
        user,
        {
          companyId: taskData.companyId,
          resourceType: 'tasks',
          department: taskData.department,
        },
        'write'
      )
    ) {
      throw new Error('Permission denied');
    }

    const validated = createTaskSchema.parse(taskData);
    const tasks = getItem(this.STORAGE_KEY, [] as Task[]);
    const newTask: Task = {
      ...validated,
      id: tinid(),
    };
    tasks.push(newTask);
    setItem(this.STORAGE_KEY, tasks);

    return newTask;
  }

  update(id: string, taskData: Partial<Task>, user: User): Task {
    const tasks = getItem(this.STORAGE_KEY, [] as Task[]);
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) throw new Error('Task not found');
    const task = tasks[index];
    if (
      !hasPermission(
        user,
        {
          companyId: task.companyId,
          resourceType: 'tasks',
          department: task.department,
        },
        'write'
      )
    ) {
      throw new Error('Permission denied');
    }
    const validated = updateTaskSchema.parse(taskData);
    tasks[index] = { ...tasks[index], ...validated };
    setItem(this.STORAGE_KEY, tasks);
    return tasks[index];
  }

  delete(id: string, user: User): void {
    const tasks = getItem(this.STORAGE_KEY, [] as Task[]);
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    if (
      !hasPermission(
        user,
        {
          companyId: task.companyId,
          resourceType: 'tasks',
          department: task.department,
        },
        'write'
      )
    ) {
      throw new Error('Permission denied');
    }
    const filtered = tasks.filter((task) => task.id !== id);
    setItem(this.STORAGE_KEY, filtered);
  }
}
