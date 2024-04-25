import { useEffect, useState } from 'react';
import db, { auth } from '@/app/firebase';
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import _ from 'lodash';
import { GameBoardToken } from '@/types/GameBoardTypes';
import { Button } from '@/components/ui/button';

const TokenList = (props: { boardId: string | null }) => {
  const [user] = useAuthState(auth);
  const [tokens, setTokens] = useState<GameBoardToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<GameBoardToken | null>();

  useEffect(() => {
    const fetchTokens = () => {
      const q = query(
        collection(db, 'tokens'),
        where('ownerId', '==', _.get(user, 'uid', ''))
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tokens = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          ownerId: doc.data().ownerId,
          isPlayer: doc.data().isPlayer,
          boardPosition: doc.data().boardPosition,
        }));
        setTokens(tokens);
      });

      return () => unsubscribe();
    };

    fetchTokens();
  }, [user]);

  const handlePlaceToken = async () => {
    if (props.boardId && selectedToken) {
      const docRef = doc(db, 'gameBoards', props.boardId);
      await updateDoc(docRef, {
        activeTokens: arrayUnion({
          ...selectedToken,
          boardPosition: [0, 0],
        }),
      });
    }
  };

  return (
    <div>
      {tokens.map((token) => (
        <div key={token.id}>
          <div
            className="w-10 h-10 bg-gray-500"
            onClick={() => setSelectedToken(token)}
          ></div>
          <p>{token.title}</p>
        </div>
      ))}
      {selectedToken && props.boardId && (
        <Button variant={'outline'} onClick={handlePlaceToken}>
          Place Token
        </Button>
      )}
    </div>
  );
};

export default TokenList;
