import { useEffect, useState } from 'react';
import db from '@/app/firebase';
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@firebase/firestore';
import { GameBoardToken } from '@/types/GameBoardTypes';
import { Button } from '@/components/ui/button';
import GameToken from '@/components/board/GameToken';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { useUser } from '@/hooks/useUser';
import { useLoader } from '@/hooks/useLoader';

const TokenList = () => {
  const { user } = useUser();
  const { load } = useLoader();
  const { focusedBoard } = useFocusedBoard();

  const [tokens, setTokens] = useState<GameBoardToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<GameBoardToken | null>();

  useEffect(() => {
    const fetchTokens = async () => {
      const q = query(
        collection(db, 'tokens'),
        where('ownerId', '==', user?.uid)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tokens = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          ownerId: doc.data().ownerId,
        }));
        setTokens(tokens);
      });

      return () => unsubscribe();
    };

    load(fetchTokens(), 'An error occurred while loading your tokens.');
  }, [user]);

  const handleInitToken = async () => {
    if (focusedBoard && selectedToken) {
      const docRef = doc(db, 'gameBoards', focusedBoard.id);
      await updateDoc(docRef, {
        activeTokens: arrayUnion({
          ...selectedToken,
          boardPosition: [0, 0],
          lastMovedAt: Date.now(),
          isPlayer: true,
        }),
      });
    }
  };

  return (
    <div>
      {tokens.map((token) => (
        <div key={token.id}>
          <div onClick={() => setSelectedToken(token)}>
            <GameToken token={token} />
          </div>
          <p>{token.title}</p>
        </div>
      ))}
      {selectedToken && focusedBoard?.id && (
        <Button variant={'outline'} onClick={handleInitToken}>
          Place Token
        </Button>
      )}
    </div>
  );
};

export default TokenList;
