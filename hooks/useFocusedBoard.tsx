'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GameBoardType } from '@/types/GameBoardTypes';
import { doc, onSnapshot } from '@firebase/firestore';
import db from '@/app/firebase';

const FocusedBoardContext = createContext<{
  focusedBoard: GameBoardType | null;
  setFocusedBoardId: any;
}>({
  focusedBoard: null,
  setFocusedBoardId: () => {},
});

export const FocusedBoardProvider = ({ children }: { children: ReactNode }) => {
  const [focusedBoard, setFocusedBoard] = useState<GameBoardType | null>(null);
  const [focusedBoardId, setFocusedBoardId] = useState<string | null>(null);

  useEffect(() => {
    if (focusedBoardId) {
      const boardDocRef = doc(db, 'gameBoards', focusedBoardId);
      const unsubscribe = onSnapshot(boardDocRef, (boardDocSnap) => {
        if (boardDocSnap.exists()) {
          setFocusedBoard(boardDocSnap.data() as GameBoardType);
        } else {
          console.error('The queried board does not exist.');
        }
      });
      // Cleanup
      return () => {
        unsubscribe();
      };
    }
  }, [focusedBoardId]);

  return (
    <FocusedBoardContext.Provider value={{ focusedBoard, setFocusedBoardId }}>
      {children}
    </FocusedBoardContext.Provider>
  );
};

export const useFocusedBoard = () => {
  const context = useContext(FocusedBoardContext);
  if (!context)
    throw new Error('useFocusedBoard must be used inside FocusedBoardProvider');
  return context;
};
