import _ from 'lodash';
import { Button } from '@/components/ui/button';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { useCampaign } from '@/hooks/useCampaign';
import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@firebase/firestore';
import db from '@/app/firebase';
import { useUser } from '@/hooks/useUser';
import { GameBoardBase } from '@/types/GameBoardTypes';
import { useLoader } from '@/hooks/useLoader';

const GameBoardList = () => {
  const { focusedBoard } = useFocusedBoard();
  const { campaign, isUserDm } = useCampaign();
  const { user } = useUser();
  const { load } = useLoader();

  const [boards, setBoards] = useState<GameBoardBase[]>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      const q = query(
        collection(db, 'gameBoards'),
        where('id', 'in', campaign?.boardIds)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const boards = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }));
        setBoards(boards);
      });

      return () => unsubscribe();
    };

    _.size(campaign?.boardIds) > 0 &&
      isUserDm &&
      load(fetchBoards(), 'An error occurred while fetching your boards.');
  }, [user, campaign?.boardIds]);

  const handleSwitchBoard = async (boardId: string) => {
    if (campaign) {
      await updateDoc(doc(db, 'campaigns', campaign?.id), {
        focusedBoardId: boardId,
      });
    }
  };

  return (
    <>
      {_.size(campaign?.boardIds) > 0 ? (
        <>
          {_.map(boards, (board) => {
            if (board.id !== focusedBoard?.id) {
              return (
                <div key={board.id}>
                  <Button
                    variant={'outline'}
                    onClick={() =>
                      load(
                        handleSwitchBoard(board.id),
                        'An error occurred while switching boards.'
                      )
                    }
                  >
                    {board.title}
                  </Button>
                </div>
              );
            }
          })}
        </>
      ) : (
        <p className="text-xs text-gray-500">N/A</p>
      )}
    </>
  );
};
export default GameBoardList;
