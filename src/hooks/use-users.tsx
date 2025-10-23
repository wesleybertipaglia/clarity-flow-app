import { useState, useEffect } from 'react';
import type { User } from '@/api/users/types';
import { getUserService } from '@/lib/services';
import { useAuth } from '@/hooks/use-auth';

const userService = getUserService();

export const useUsers = () => {
  const { company, currentUser } = useAuth();
  const companyId = company?.id ?? '';

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (currentUser && companyId) {
      setUsers(userService.getAllByCompanyId(companyId));
    }
  }, [currentUser, companyId]);

  const addUser = (userId: string, userData?: Partial<Omit<User, 'id'>>) => {
    const newUser = userService.create(userId, userData);
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<Omit<User, 'id'>>) => {
    const updatedUser = userService.update(
      id,
      updates,
      currentUser || undefined
    );
    if (updatedUser) {
      setUsers((prev) =>
        prev.map((emp) => (emp.id === id ? updatedUser : emp))
      );
    }
  };

  return {
    users,
    addUser,
    updateUser,
  };
};
