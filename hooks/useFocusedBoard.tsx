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
import { useCampaign } from '@/hooks/useCampaign';
import { useToast } from '@/components/ui/use-toast';

const FocusedBoardContext = createContext<{
  focusedBoard: GameBoardType | null;
  toggleSetting: (key: SettingsEnum, toggle: boolean) => void;
}>({
  focusedBoard: null,
  toggleSetting: () => {},
});

export const FocusedBoardProvider = ({ children }: { children: ReactNode }) => {
  const { campaign, isUserDm } = useCampaign();

  const [focusedBoard, setFocusedBoard] = useState<GameBoardType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (campaign?.focusedBoardId) {
      const boardDocRef = doc(db, 'gameBoards', campaign.focusedBoardId);
      const unsubscribe = onSnapshot(boardDocRef, (boardDocSnap) => {
        if (boardDocSnap.exists()) {
          if (focusedBoard && !isUserDm) {
            toast({
              title: 'New Board',
              description: `The DM has switched game board to "${boardDocSnap.data().title}"`,
            });
          }
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
  }, [campaign?.focusedBoardId]);

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
    <FocusedBoardContext.Provider value={{ focusedBoard, toggleSetting }}>
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
