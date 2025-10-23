import {
  BarChart,
  Calendar,
  MessageSquare,
  UserCheck,
  CheckSquare,
  Settings,
  DollarSign,
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: BarChart,
    tooltip: 'Dashboard',
  },
  {
    id: 'chat',
    path: '/chat',
    label: 'AI Chat',
    icon: MessageSquare,
    tooltip: 'AI Chat',
  },
  {
    id: 'sales',
    path: '/sales',
    label: 'Sales',
    icon: DollarSign,
    tooltip: 'Sales',
  },
  {
    id: 'appointments',
    path: '/appointments',
    label: 'Appointments',
    icon: Calendar,
    tooltip: 'Appointments',
  },
  {
    id: 'tasks',
    path: '/tasks',
    label: 'Tasks',
    icon: CheckSquare,
    tooltip: 'Tasks',
  },
  {
    id: 'employees',
    path: '/employees',
    label: 'Employees',
    icon: UserCheck,
    tooltip: 'Employees',
  },
  {
    id: 'settings',
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    tooltip: 'Settings',
  },
];

export const getPageTitle = (pathname: string): string => {
  if (pathname === '/' || pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/chat')) return 'AI Chat';
  if (pathname.startsWith('/appointments')) return 'Appointments';
  if (pathname.startsWith('/sales')) return 'Sales';
  if (pathname.startsWith('/employees')) return 'Employees';
  if (pathname.startsWith('/tasks')) return 'Tasks';
  if (pathname.startsWith('/settings')) return 'Settings';
  return 'ClarityFlow';
};
