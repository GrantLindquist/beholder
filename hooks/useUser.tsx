'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getUserFromSession } from '@/utils/userSession';
import { UserSession } from '@/types/UserTypes';

const UseUser = createContext<{
  user: UserSession | null;
}>({
  user: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getUserFromSession();
      const sessionUser = session.user;
      setUser({
        displayName: sessionUser.displayName,
        email: sessionUser.email,
        photoURL: sessionUser.photoURL,
        uid: sessionUser.uid,
      });
    };

    fetchUser();
  }, []);

  return <UseUser.Provider value={{ user }}>{children}</UseUser.Provider>;
};

export const useUser = () => {
  const context = useContext(UseUser);
  if (!context) throw new Error('useUser must be used inside UserProvider');
  return context;
};
