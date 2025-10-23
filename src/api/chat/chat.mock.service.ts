import type { Message } from './types';
import type { ChatContext } from './chat.interface';
import { tinid } from '@wesleybertipaglia/tinid';
import type { IChatService } from './chat.interface';
import { createMessageSchema } from './chat.schema';
import { getItem, setItem, removeItem } from '@/lib/storage';
import { config } from '@/config/environment';

import { getAppointmentsService } from '@/lib/services';
import { getTasksService } from '@/lib/services';
import { getUserService } from '@/lib/services';
import { getSalesService } from '@/lib/services';
import {
  hasPermission as hasPermissionUtil,
  type ResourceType,
} from '@/lib/permissions';
import type { User } from '../users/types';

export class ChatMockService implements IChatService {
  private readonly API_URL = `${config.api.baseUrl}/ai/chat`;

  private getStorageKey(userId?: string): string {
    return userId ? `aiChatMessages_${userId}` : 'aiChatMessages';
  }

  private getStoredMessages(userId?: string): Message[] {
    const storageKey = this.getStorageKey(userId);
    const messages = getItem(storageKey, [] as Message[]);
    return messages.map((msg: Message) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  }

  getMessages(userId?: string): Message[] {
    return this.getStoredMessages(userId);
  }

  async addMessage(
    messageData: Omit<Message, 'id' | 'timestamp'>,
    user: User,
    context: ChatContext,
    onMessageUpdate?: () => void
  ): Promise<Message> {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const validated = createMessageSchema.parse(messageData);

    const messages = this.getStoredMessages(user.id);

    const newMessage: Message = {
      ...validated,
      id: tinid(),
      timestamp: new Date(),
    };

    messages.push(newMessage);
    setItem(this.getStorageKey(user.id), messages);

    const command = this.parseCommand(messageData.text);

    if (command) {
      const hasPerm = this.hasPermission(user, command);

      if (!hasPerm) {
        const errorMessage: Message = {
          id: tinid(),
          role: 'model',
          text: `Sorry, you don't have permission to ${command.action} ${command.type}s.`,
          timestamp: new Date(),
        };
        messages.push(errorMessage);
        setItem(this.getStorageKey(user.id), messages);
        return newMessage;
      }

      const thinkingMessage: Message = {
        id: tinid(),
        role: 'model',
        text: 'Processing command...',
        timestamp: new Date(),
      };
      messages.push(thinkingMessage);
      setItem(this.getStorageKey(user.id), messages);

      const apiKey = localStorage.getItem('googleAiApiKey') || '';
      const requestBody = {
        question: messageData.text,
        context,
        action: command.action,
        type: command.type,
      };

      fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          const updated = this.getStoredMessages(user.id);
          const thinkingIndex = updated.findIndex(
            (msg) => msg.id === thinkingMessage.id
          );
          if (thinkingIndex !== -1) {
            updated[thinkingIndex] = {
              ...thinkingMessage,
              text: data.answer,
              timestamp: new Date(),
            };
          }

          if (data.action && data.type && data.data) {
            this.performAction(data.type, data.action, data.data, user);
          } else {
          }

          setItem(this.getStorageKey(user.id), updated);

          if (onMessageUpdate) {
            onMessageUpdate();
          }
        })
        .catch((err) => {
          const updated = this.getStoredMessages(user.id);
          const thinkingIndex = updated.findIndex(
            (msg) => msg.id === thinkingMessage.id
          );
          if (thinkingIndex !== -1) {
            updated[thinkingIndex] = {
              ...thinkingMessage,
              text: `Sorry, I encountered an error processing your command: ${err.message}`,
              timestamp: new Date(),
            };
          }
          setItem(this.getStorageKey(user.id), updated);

          if (onMessageUpdate) {
            onMessageUpdate();
          }
        });

      return newMessage;
    }

    const thinkingMessage: Message = {
      id: tinid(),
      role: 'model',
      text: 'Thinking...',
      timestamp: new Date(),
    };
    messages.push(thinkingMessage);
    setItem(this.getStorageKey(user.id), messages);

    const apiKey = localStorage.getItem('googleAiApiKey') || '';
    const requestBody = {
      question: messageData.text,
      context,
    };

    fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const updated = this.getStoredMessages(user.id);
        const thinkingIndex = updated.findIndex(
          (msg) => msg.id === thinkingMessage.id
        );
        if (thinkingIndex !== -1) {
          updated[thinkingIndex] = {
            ...thinkingMessage,
            text: data.answer,
            timestamp: new Date(),
          };
        } else {
          const aiMessage: Message = {
            id: tinid(),
            role: 'model',
            text: data.answer,
            timestamp: new Date(),
          };
          updated.push(aiMessage);
        }
        setItem(this.getStorageKey(user.id), updated);

        if (onMessageUpdate) {
          onMessageUpdate();
        }

        if (data.action && data.type && data.data) {
          this.performAction(data.type, data.action, data.data, user);
        } else {
        }
      })
      .catch((err) => {
        const updated = this.getStoredMessages(user.id);
        const thinkingIndex = updated.findIndex(
          (msg) => msg.id === thinkingMessage.id
        );
        if (thinkingIndex !== -1) {
          updated[thinkingIndex] = {
            ...thinkingMessage,
            text: `Sorry, I encountered an error: ${err.message}`,
            timestamp: new Date(),
          };
        } else {
          const errorMessage: Message = {
            id: tinid(),
            role: 'model',
            text: `Sorry, I encountered an error: ${err.message}`,
            timestamp: new Date(),
          };
          updated.push(errorMessage);
        }
        setItem(this.getStorageKey(user.id), updated);

        if (onMessageUpdate) {
          onMessageUpdate();
        }
      });

    return newMessage;
  }

  private parseCommand(
    text: string
  ): { action: string; type: string; data: Record<string, unknown> } | null {
    const match = text.match(/^@(\w+)-(\w+)\s*(.+)?$/);
    if (!match) {
      return null;
    }

    const action = match[1];
    const type = match[2];
    const params = match[3] || '';

    if (!['create', 'update', 'delete', 'read'].includes(action)) {
      return null;
    }
    if (!['task', 'appointment', 'employee', 'sale'].includes(type)) {
      return null;
    }

    if (action === 'read') {
      return { action, type, data: {} };
    }

    const data: Record<string, unknown> = {};
    if (type === 'tasks') {
      const taskMatch = params.match(/"([^"]+)"\s+for\s+(\w+)/);
      if (taskMatch) {
        data.title = taskMatch[1];
        data.department = taskMatch[2];
        data.status = 'To Do';
        data.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
      } else {
      }
    } else if (type === 'appointments') {
      const aptMatch = params.match(/"([^"]+)"\s+at\s+(.+)/);
      if (aptMatch) {
        data.title = aptMatch[1];
        data.startTime = aptMatch[2];
        data.endTime = new Date(
          new Date(aptMatch[2]).getTime() + 60 * 60 * 1000
        ).toISOString();
        data.clientIds = [];
        data.userIds = [];
      } else {
      }
    } else if (type === 'employees') {
      const empMatch = params.match(/"([^"]+)"\s+(.+)\s+(\w+)/);
      if (empMatch) {
        data.name = empMatch[1];
        data.email = empMatch[2];
        data.department = empMatch[3];
        data.role = 'Employee';
      } else {
      }
    } else if (type === 'sales') {
      const saleMatch = params.match(/"([^"]+)"\s+(\d+(?:\.\d+)?)/);
      if (saleMatch) {
        data.title = saleMatch[1];
        data.value = parseFloat(saleMatch[2]);
        data.status = 'Pending';
      } else {
      }
    }

    return { action, type, data };
  }

  private hasPermission(
    user: User,
    command: { action: string; type: string; data: Record<string, unknown> }
  ): boolean {
    const operation = command.action === 'read' ? 'read' : 'write';
    const department =
      typeof command.data.department === 'string'
        ? command.data.department
        : undefined;

    let resourceType: ResourceType;
    switch (command.type) {
      case 'task':
        resourceType = 'tasks';
        break;
      case 'appointment':
        resourceType = 'appointments';
        break;
      case 'employee':
        resourceType = 'employees';
        break;
      case 'sale':
        resourceType = 'sales';
        break;
      default:
        return false;
    }

    if (!user.companyId) {
      return false;
    }

    const resource = {
      companyId: user.companyId,
      resourceType,
      department,
    };
    return hasPermissionUtil(user, resource, operation);
  }

  private performAction(
    type: string,
    action: string,
    data: unknown,
    user: User
  ) {
    try {
      (data as any).companyId = user.companyId;

      if (type === 'appointment' && action === 'create') {
        const appointmentService = getAppointmentsService();
        appointmentService.createAppointment(data as any, user);
      } else if (type === 'task' && action === 'create') {
        const taskService = getTasksService();
        taskService.create(data as any, user);
      } else if (type === 'employee' && action === 'create') {
        const userService = getUserService();
        userService.create(tinid(), data as any);
      } else if (type === 'sale' && action === 'create') {
        const salesService = getSalesService();
        salesService.create(data as any, user);
      } else {
        console.warn('⚠️ Unknown action type:', { type, action });
      }
    } catch (error) {
      console.error('❌ Error performing action:', {
        type,
        action,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  clearMessages(user: User): void {
    if (!user) throw new Error('User not authenticated');
    removeItem(this.getStorageKey(user.id));
  }
}
