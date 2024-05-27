'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

const FowContext = createContext<{
  eraseFow: boolean | null;
  setEraseFow(eraseFow: boolean | null): void;
}>({
  eraseFow: null,
  setEraseFow() {},
});

export const FowProvider = ({ children }: { children: ReactNode }) => {
  /*
   * true: erasing FOW tiles
   * false: adding FOW tiles
   * null: neither
   */
  const [eraseFow, setEraseFow] = useState<boolean | null>(null);

  return (
    <FowContext.Provider value={{ eraseFow: eraseFow, setEraseFow }}>
      {children}
    </FowContext.Provider>
  );
};

export const useFow = () => {
  const context = useContext(FowContext);
  if (!context) throw new Error('useFow must be used inside FowProvider');
  return context;
};
