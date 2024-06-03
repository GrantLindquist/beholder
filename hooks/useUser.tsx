'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { clearSession, getUserFromSession } from '@/utils/userSession';
import { UserSession } from '@/types/UserTypes';
import { useLoader } from '@/hooks/useLoader';
import { signOut } from '@firebase/auth';
import { auth } from '@/app/firebase';

const UserContext = createContext<{
  user: UserSession | null;
  fetchUser: () => void;
  signOutUser: () => Promise<any>;
}>({
  user: null,
  fetchUser: () => {},
  signOutUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { load } = useLoader();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    load(fetchUser(), 'An error occurred while loading the user.');
  }, []);

  const fetchUser = async () => {
    const session = await getUserFromSession();
    const sessionUser = session?.user || null;
    if (sessionUser) {
      setUser({
        displayName: sessionUser.displayName,
        email: sessionUser.email,
        photoURL: sessionUser.photoURL,
        uid: sessionUser.uid,
      });
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    await clearSession();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, fetchUser, signOutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used inside UserProvider');
  return context;
};
