import { useState, useEffect } from 'react';
import type { Task } from '@/api/tasks/types';
import { getTasksService } from '@/lib/services';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

const taskService = getTasksService();

export const useTasks = () => {
  const { userData, company } = useAuth();
  const companyId = company?.id ?? '';

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (companyId) {
      setTasks(taskService.getAll(companyId));
    }
  }, [companyId]);

  const addTask = (task: Omit<Task, 'id'>) => {
    try {
      if (!userData) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }
      const newTask = taskService.create(task, userData);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error adding task:', error);
      toast.error('Failed to add task', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const updateTask = (id: string, data: Partial<Task>) => {
    try {
      if (!userData) throw new Error('User not authenticated');
      const updated = taskService.update(id, data, userData);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error updating task:', error);
      toast.error('Failed to update task', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const deleteTask = (id: string) => {
    try {
      if (!userData) throw new Error('User not authenticated');
      taskService.delete(id, userData);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('❌ Error deleting task:', error);
      toast.error('Failed to delete task', {
        description: errorMessage,
      });
      throw error;
    }
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  };
};
