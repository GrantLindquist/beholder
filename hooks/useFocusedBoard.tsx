'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  ActiveGameBoardToken,
  GameBoardType,
  SettingsEnum,
} from '@/types/GameBoardTypes';
import {
  doc,
  onSnapshot,
  runTransaction,
  updateDoc,
} from '@firebase/firestore';
import db from '@/app/firebase';
import { useCampaign } from '@/hooks/useCampaign';
import { useToast } from '@/components/ui/use-toast';
import { useLoader } from '@/hooks/useLoader';

const FocusedBoardContext = createContext<{
  focusedBoard: GameBoardType | null;
  toggleSetting: (key: SettingsEnum, toggle: boolean) => Promise<void>;
  updateToken: (
    tokenRef: ActiveGameBoardToken,
    updates: Object
  ) => Promise<void>;
}>({
  focusedBoard: null,
  toggleSetting: async () => {},
  updateToken: async () => {},
});

export const FocusedBoardProvider = ({ children }: { children: ReactNode }) => {
  const { campaign, isUserDm } = useCampaign();

  const [focusedBoard, setFocusedBoard] = useState<GameBoardType | null>(null);
  const { toast } = useToast();
  const { load } = useLoader();

  useEffect(() => {
    if (campaign?.focusedBoardId) {
      const boardDocRef = doc(db, 'gameBoards', campaign.focusedBoardId);
      const unsubscribe = onSnapshot(boardDocRef, (boardDocSnap) => {
        if (boardDocSnap.exists()) {
          if (focusedBoard && !isUserDm) {
            toast({
              title: 'New Board',
              description: (
                <p>
                  The DM has switched game board to{' '}
                  <b>{boardDocSnap.data().title}</b>
                </p>
              ),
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

  const updateToken = async (
    tokenRef: ActiveGameBoardToken,
    updates: Object
  ) => {
    if (focusedBoard) {
      // Optimistically update state before sending data to firebase
      const docRef = doc(db, 'gameBoards', focusedBoard.id);
      const index = focusedBoard.activeTokens.findIndex(
        (token) => token.id === tokenRef.id
      );

      if (index !== -1) {
        const tokens = focusedBoard.activeTokens;
        tokens[index] = {
          ...tokens[index],
          ...updates,
        };

        setFocusedBoard({
          ...focusedBoard,
          activeTokens: tokens,
        });

        load(
          runTransaction(db, async (transaction) => {
            transaction.update(docRef, { activeTokens: tokens });
          }),
          "An error occurred while moving your token. Other player's may not be able to see your movement.",
          true
        );
      }
    }
  };

  return (
    <FocusedBoardContext.Provider
      value={{ focusedBoard, toggleSetting, updateToken }}
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
