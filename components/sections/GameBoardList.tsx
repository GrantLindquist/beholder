import _ from 'lodash';
import { Button } from '@/components/ui/button';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { useCampaign } from '@/hooks/useCampaign';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from '@firebase/firestore';
import db from '@/app/firebase';
import { useUser } from '@/hooks/useUser';
import { GameBoardBase } from '@/types/GameBoardTypes';
import { useToast } from '@/components/ui/use-toast';

const GameBoardList = () => {
  const { focusedBoard, setFocusedBoardId } = useFocusedBoard();
  const { campaign } = useCampaign();
  const { user } = useUser();
  const { toast } = useToast();

  const [boards, setBoards] = useState<GameBoardBase[]>([]);

  useEffect(() => {
    try {
      const fetchBoards = () => {
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

      fetchBoards();
    } catch (e) {
      console.error(e);
      toast({
        title: 'Critical Fail',
        description: 'An error occurred while fetching your boards.',
      });
    }
  }, [user]);

  return (
    <>
      {_.map(boards, (board) => {
        if (board.id !== focusedBoard?.id) {
          return (
            <div key={board.id}>
              <Button
                variant={'outline'}
                onClick={() => setFocusedBoardId(board.id)}
              >
                {board.title}
              </Button>
            </div>
          );
        }
      })}
    </>
  );
};
export default GameBoardList;
