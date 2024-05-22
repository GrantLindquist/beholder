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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { useCampaign } from '@/hooks/useCampaign';

const TokenList = () => {
  const { user } = useUser();
  const { load } = useLoader();
  const { focusedBoard } = useFocusedBoard();
  const { isUserDm } = useCampaign();

  const [tokens, setTokens] = useState<GameBoardToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<GameBoardToken | null>();
  const [disablePlaceButton, setDisablePlaceButton] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

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
          tokenImgURL: doc.data().tokenImgURL,
          isMonster: doc.data().isMonster || false,
        }));
        setTokens(tokens);
      });

      return () => unsubscribe();
    };

    load(fetchTokens(), 'An error occurred while loading your tokens.');
  }, [user]);

  useEffect(() => {
    if (focusedBoard && selectedToken) {
      if (!selectedToken.isMonster) {
        const tokenCount = focusedBoard.activeTokens.reduce(
          (count, token) =>
            count + (token.title === selectedToken.title ? 1 : 0),
          1
        );
        setDisablePlaceButton(tokenCount > 1);
      } else {
        setDisablePlaceButton(false);
      }
    }
  }, [selectedToken]);

  const calculateMonsterNumber = (title: string) => {
    return focusedBoard
      ? focusedBoard.activeTokens.reduce(
          (count, token) =>
            count + (token.isMonster && token.title === title ? 1 : 0),
          1
        )
      : 0;
  };

  const handleInitToken = async () => {
    if (focusedBoard && selectedToken) {
      const monsterNumber = selectedToken.isMonster
        ? calculateMonsterNumber(selectedToken.title)
        : 0;
      const docRef = doc(db, 'gameBoards', focusedBoard.id);
      await updateDoc(docRef, {
        activeTokens: arrayUnion({
          ...selectedToken,
          boardPosition: [0, 0],
          lastMovedAt: Date.now(),
          ...(selectedToken.isMonster && {
            id: `${selectedToken.id}-${monsterNumber}`,
            monsterNumber: monsterNumber,
          }),
        }),
      });
    }
  };

  const handleSearch = (event: any) => {
    const value = event.target.value || '';
    setSearchQuery(value);
  };

  // TODO: Close menu after token is placed - otherwise player tokens can be erroneously duplicated
  return (
    <>
      <Input placeholder="Search" className="my-2" onChange={handleSearch} />
      <div className="grid grid-cols-2 space-x-2 space-y-2">
        {tokens.map((token) => {
          if (
            (isUserDm || !token.isMonster) &&
            token.title.toLowerCase().trim().includes(searchQuery.toLowerCase())
          ) {
            return (
              <div key={token.id}>
                <div onClick={() => setSelectedToken(token)}>
                  <GameToken
                    token={token}
                    selected={selectedToken?.id === token.id}
                  />
                </div>
              </div>
            );
          }
        })}
      </div>
      {selectedToken && focusedBoard?.id && (
        <>
          {!disablePlaceButton ? (
            <Button variant={'outline'} onClick={handleInitToken}>
              Place Token
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <Button variant={'outline'} disabled>
                  Place Token
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Player tokens cannot be duplicated on the board.</p>
              </TooltipContent>
            </Tooltip>
          )}
        </>
      )}
    </>
  );
};

export default TokenList;
