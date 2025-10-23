import type { Message } from './types';
import type { User } from '@/api/users/types';
import type { Company } from '@/api/company/types';
import type { Task } from '@/api/tasks/types';
import type { Sale } from '@/api/sales/types';

export interface ChatContext {
  user: User;
  companies: Company[];
  employees: User[];
  tasks: Task[];
  sales: Sale[];
}

export interface IChatService {
  getMessages(userId?: string): Message[];
  addMessage(
    message: Omit<Message, 'id' | 'timestamp'>,
    user: User,
    context: ChatContext,
    onMessageUpdate?: () => void
  ): Promise<Message>;
  clearMessages(user: User): void;
}
