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
import { useLoader } from '@/hooks/useLoader';

const UserContext = createContext<{
  user: UserSession | null;
}>({
  user: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { load } = useLoader();
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

    load(fetchUser(), 'An error occurred while loading the user.');
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used inside UserProvider');
  return context;
};
