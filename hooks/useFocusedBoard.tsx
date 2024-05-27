'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GameBoardType, SettingsEnum } from '@/types/GameBoardTypes';
import { doc, onSnapshot, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';

const FocusedBoardContext = createContext<{
  focusedBoard: GameBoardType | null;
  setFocusedBoardId: any;
  toggleSetting: (key: SettingsEnum, toggle: boolean) => void;
}>({
  focusedBoard: null,
  setFocusedBoardId: () => {},
  toggleSetting: () => {},
});

export const FocusedBoardProvider = ({ children }: { children: ReactNode }) => {
  const [focusedBoard, setFocusedBoard] = useState<GameBoardType | null>(null);
  const [focusedBoardId, setFocusedBoardId] = useState<string | null>(null);

  // TODO: Add live updates for board switching, prob a focusedBoardId campaign attribute?
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

  const toggleSetting = async (key: SettingsEnum, toggle: boolean) => {
    if (focusedBoard) {
      await updateDoc(doc(db, 'gameBoards', focusedBoard.id), {
        ...focusedBoard,
        settings: {
          ...focusedBoard.settings,
          [key]: toggle,
        },
      });
    }
  };

  return (
    <FocusedBoardContext.Provider
      value={{ focusedBoard, setFocusedBoardId, toggleSetting }}
    >
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
