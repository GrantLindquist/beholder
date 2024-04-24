'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GameBoard from '@/components/sections/GameBoard';
import { doc, onSnapshot } from '@firebase/firestore';
import db, { auth } from '@/app/firebase';
import _ from 'lodash';
import { useCampaign } from '@/hooks/useCampaign';
import CreateGameBoardDialog from '@/components/sections/CreateGameBoardDialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import TokenList from '@/components/sections/TokenList';

const CampaignPage = ({ params }: { params: { id: string } }) => {
  const [boardScale, setBoardScale] = useState(1);
  const [boardIds, setBoardIds] = useState<string[]>([]);
  const [focusedBoardId, setFocusedBoardId] = useState<string | null>(null);

  const { enterCampaign, isUserDm } = useCampaign();
  const [user] = useAuthState(auth);

  const handleMagnify = (_event: Event, newValue: number | number[]) => {
    setBoardScale(newValue as number);
  };

  // Initialize campaign
  useEffect(() => {
    enterCampaign(params.id, _.get(user, 'uid', ''));

    // Subscribe to receive live board creations & deletions
    const docRef = doc(db, 'campaigns', params.id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setBoardIds(_.get(docSnap.data(), 'board_ids', []));
        !focusedBoardId &&
          setFocusedBoardId(_.get(docSnap.data(), 'board_ids.0'));
      } else {
        console.error('The queried board does not exist.');
      }
    });
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [params.id]);

  return (
    <div className="p-3">
      <div className="flex">
        <div className="w-20 h-full">
          <TokenList />
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {focusedBoardId ? (
            <GameBoard scale={boardScale} boardId={focusedBoardId} />
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default CampaignPage;
