import type { User } from '@/api/users/types';

export type Operation = 'read' | 'write';

export type ResourceType =
  | 'employees'
  | 'tasks'
  | 'appointments'
  | 'sales'
  | 'company';

export interface Resource {
  companyId: string;
  resourceType: ResourceType;
  department?: string;
}

const DEPARTMENT_RESOURCES: Record<string, ResourceType[]> = {
  HR: ['employees', 'tasks', 'appointments'],
  Sales: ['sales', 'tasks', 'appointments'],
  Admin: ['employees', 'tasks', 'appointments', 'sales', 'company'],
  Marketing: ['tasks', 'appointments'],
  Engineering: ['tasks', 'appointments'],
  General: ['tasks', 'appointments'],
};

export function hasPermission(
  user: User,
  resource: Resource,
  operation: Operation
): boolean {
  if (user.companyId !== resource.companyId) {
    return false;
  }

  if (user.role === 'Owner') {
    return true;
  }

  if (operation === 'read') {
    return true;
  }

  const allowedResources = user.department ? DEPARTMENT_RESOURCES[user.department] || [] : [];

  if (!allowedResources.includes(resource.resourceType)) {
    return false;
  }

  if (user.role === 'Manager') {
    if (resource.resourceType === 'company') {
      return false;
    }
    return true;
  }

  if (user.role === 'Employee') {
    return false;
  }

  return false;
}
