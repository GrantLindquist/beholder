import { useEffect, useState } from 'react';
import db, { auth } from '@/app/firebase';
import { collection, onSnapshot, query, where } from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import _ from 'lodash';
import { GameBoardToken } from '@/types/GameBoardTypes';
import { Button } from '@/components/ui/button';
import { useCampaign } from '@/hooks/useCampaign';

const TokenList = () => {
  const [user] = useAuthState(auth);
  const [tokens, setTokens] = useState<GameBoardToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<GameBoardToken | null>();

  const { campaign } = useCampaign();

  useEffect(() => {
    const fetchTokens = () => {
      const q = query(
        collection(db, 'tokens'),
        where('owner_id', '==', _.get(user, 'uid', ''))
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tokens = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          ownerId: doc.data().owner_id,
          isPlayer: doc.data().is_player,
        }));
        setTokens(tokens);
      });

      return () => unsubscribe();
    };

    fetchTokens();
  }, [user]);

  // TODO: Figure out best way to reference board. maybe a hook?
  const handlePlaceToken = async () => {};

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
      {selectedToken && _.size(campaign?.boardIds) > 0 && (
        <Button variant={'outline'} onClick={handlePlaceToken}>
          Place Token
        </Button>
      )}
    </div>
  );
};

export default TokenList;
