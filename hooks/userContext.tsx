'use client';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { getUserFromSession } from '@/utils/userSession';
import { UserSession } from '@/types/UserTypes';

export const UserContext = createContext<{
  user: UserSession | null;
}>({
  user: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getUserFromSession();
      setUser(session.user);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
