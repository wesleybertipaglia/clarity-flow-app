import type { TaskStatus, Department } from '@/lib/shared-types';

export {
  type TaskStatus,
  type Department,
  TASK_STATUSES,
  DEPARTMENTS,
} from '@/lib/shared-types';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
  assigneeId: string;
  department: Department;
  companyId: string;
}
