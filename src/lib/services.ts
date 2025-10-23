import type { IAppointmentService } from '@/api/appointments/appointments.interface';
import { AppointmentMockService } from '@/api/appointments/appointments.mock.service';
import type { ITaskService } from '@/api/tasks/tasks.interface';
import { TaskMockService } from '@/api/tasks/tasks.mock.service';
import type { IUserService } from '@/api/users/users.interface';
import { UserMockService } from '@/api/users/users.mock.service';
import type { ICompanyService } from '@/api/company/company.interface';
import { CompanyMockService } from '@/api/company/company.mock.service';
import type { IChatService } from '@/api/chat/chat.interface';
import { ChatMockService } from '@/api/chat/chat.mock.service';
import type { ISaleService } from '@/api/sales/sales.interface';
import { SaleMockService } from '@/api/sales/sales.mock.service';

export function getAppointmentsService(): IAppointmentService {
  return new AppointmentMockService();
}

export function getTasksService(): ITaskService {
  return new TaskMockService();
}

export function getUserService(): IUserService {
  return new UserMockService();
}

export function getCompanyService(): ICompanyService {
  return new CompanyMockService();
}

export function getChatService(): IChatService {
  return new ChatMockService();
}

export function getSalesService(): ISaleService {
  return new SaleMockService();
}
