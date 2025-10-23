export type Role = 'Owner' | 'Manager' | 'Employee';
export type Department =
  | 'HR'
  | 'Marketing'
  | 'Engineering'
  | 'Admin'
  | 'Sales'
  | 'General';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type SaleStatus = 'Pending' | 'Processing' | 'Finished' | 'Canceled';

export const ROLES: Role[] = ['Owner', 'Manager', 'Employee'];
export const DEPARTMENTS: Department[] = [
  'HR',
  'Marketing',
  'Engineering',
  'Admin',
  'Sales',
  'General',
];
export const TASK_STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
export const SALE_STATUSES: SaleStatus[] = [
  'Pending',
  'Processing',
  'Finished',
  'Canceled',
];
