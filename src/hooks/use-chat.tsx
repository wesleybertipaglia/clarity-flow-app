import { useState, useEffect } from 'react';
import type { Message } from '@/api/chat/types';
import { getChatService } from '@/lib/services';
import { useAuth } from '@/hooks/use-auth';
import { useUsers } from '@/hooks/use-users';
import { useTasks } from '@/hooks/use-tasks';
import { useSales } from '@/hooks/use-sales';

import { toast } from 'sonner';

const chatService = getChatService();

export const useChat = () => {
  const { user, userData, company } = useAuth();

  const { users: employees } = useUsers();
  const { tasks } = useTasks();
  const { sales } = useSales();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (user?.id) {
      setMessages(chatService.getMessages(user.id));
    }
  }, [user?.id]);

  const addMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    try {
      if (!userData || !company) {
        throw new Error('User not authenticated');
      }

      const context = {
        user: userData,
        companies: [company],
        employees,
        tasks,
        sales,
      };

      const newMessage = await chatService.addMessage(
        message,
        userData,
        context,
        () => {
          const updatedMessages = chatService.getMessages(user.id);
          setMessages(updatedMessages);
        }
      );
      const updatedMessages = chatService.getMessages(user.id);
      setMessages(updatedMessages);

      return newMessage;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error adding message:', error);
      toast.error('Failed to send message', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const clearMessages = () => {
    try {
      if (!userData) throw new Error('User not authenticated');
      chatService.clearMessages(userData);
      setMessages([]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error clearing messages:', error);
      toast.error('Failed to clear messages', {
        description: errorMessage,
      });
      throw error;
    }
  };

  return {
    messages,
    addMessage,
    clearMessages,
  };
};
