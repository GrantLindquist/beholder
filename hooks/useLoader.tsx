'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Loader } from '@/components/misc/Loader';

const LoaderContext = createContext<{
  load: (promise: Promise<any>, error: string, displayLoader?: boolean) => void;
}>({
  load: () => {},
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();

  const [loadingUI, setLoadingUI] = useState(false);

  const load = async (
    promise: Promise<any>,
    error: string,
    hideLoader?: boolean
  ) => {
    !loadingUI && hideLoader && setLoadingUI(true);
    try {
      await promise;
      setLoadingUI(false);
    } catch (e) {
      console.error('An error occurred:', e);
      toast({
        title: 'Critical Fail',
        description: error,
      });
      setTimeout(() => setLoadingUI(false), 500);
    }
  };

  return (
    <LoaderContext.Provider value={{ load }}>
      {loadingUI && <Loader />}
      {children}
      <Toaster />
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) throw new Error('useLoader must be used inside LoaderProvider');
  return context;
};
