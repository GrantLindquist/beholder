'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GameBoard from '@/components/sections/GameBoard';
import {
  arrayRemove,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from '@firebase/firestore';
import db, { auth } from '@/app/firebase';
import _ from 'lodash';
import { useCampaign } from '@/hooks/useCampaign';
import CreateGameBoardDialog from '@/components/sections/CreateGameBoardDialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import TokenList from '@/components/sections/TokenList';
import { Button } from '@/components/ui/button';

const CampaignPage = ({ params }: { params: { id: string } }) => {
  const [boardScale, setBoardScale] = useState(1);
  const [boardIds, setBoardIds] = useState<string[]>([]);
  const [focusedBoardId, setFocusedBoardId] = useState<string | null>(null);

  const { campaign, enterCampaign, isUserDm } = useCampaign();
  const [user] = useAuthState(auth);

  // Initialize campaign
  useEffect(() => {
    enterCampaign(params.id, _.get(user, 'uid', ''));

    // Subscribe to receive live board creations & deletions
    const docRef = doc(db, 'campaigns', params.id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setBoardIds(_.get(docSnap.data(), 'boardIds', []));
        !focusedBoardId &&
          setFocusedBoardId(_.get(docSnap.data(), 'boardIds.0'));
      } else {
        console.error('The queried board does not exist.');
      }
    });
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [params.id]);

  const handleMagnify = (_event: Event, newValue: number | number[]) => {
    setBoardScale(newValue as number);
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (campaign) {
      // Delete from game_boards
      const boardDocRef = doc(db, 'gameBoards', boardId);
      await deleteDoc(boardDocRef);

      // Delete id reference from campaign
      const campaignDocRef = doc(db, 'campaigns', campaign.id);
      await updateDoc(campaignDocRef, {
        boardIds: arrayRemove(boardId),
      });
    }
  };

  return (
    <div className="p-3">
      <div className="flex">
        <div className="w-20 h-full">
          <TokenList boardId={focusedBoardId} />
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {focusedBoardId ? (
            <>
              <GameBoard scale={boardScale} boardId={focusedBoardId} />
              <CreateGameBoardDialog />
            </>
          ) : (
            <>
              <p>There are no active boards for this campaign.</p>
              {isUserDm && <CreateGameBoardDialog />}
            </>
          )}
        </div>
        <div className="w-20 h-full flex flex-col items-center">
          {focusedBoardId && (
            <>
              <SearchIcon />
              <Slider
                sx={{
                  height: 100,
                }}
                orientation={'vertical'}
                value={boardScale}
                onChange={handleMagnify}
                defaultValue={1}
                min={0.3}
                max={3}
                step={0.0001}
              />
              <Button
                variant={'destructive'}
                onClick={() => handleDeleteBoard(focusedBoardId)}
              >
                Delete Board
              </Button>
            </>
          )}
          {_.map(boardIds, (id) => (
            <div key={id}>
              {focusedBoardId != id && (
                <Button
                  variant={'outline'}
                  onClick={() => setFocusedBoardId(id)}
                >
                  {id}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CampaignPage;
