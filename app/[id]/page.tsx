'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GameBoard from '@/components/GameBoard';
import { doc, getDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import _ from 'lodash';
import { useCampaign } from '@/hooks/useCampaign';
import CreateGameBoardDialog from '@/components/CreateGameBoardDialog';

const CampaignPage = ({ params }: { params: { id: string } }) => {
  const [boardScale, setBoardScale] = useState(1);
  const [boardIds, setBoardIds] = useState<string[]>([]);
  const [focusedBoardId, setFocusedBoardId] = useState<string | null>(null);

  const { isUserDm } = useCampaign();

  const handleMagnify = (_event: Event, newValue: number | number[]) => {
    setBoardScale(newValue as number);
  };

  // TODO: Subscribe to live board creations & deletions
  // TODO: Change this to a query that only returns board_ids
  const fetchBoardIds = async (campaign_id: string) => {
    const docRef = doc(db, 'campaigns', campaign_id);
    const docSnap = await getDoc(docRef);
    setBoardIds(_.get(docSnap.data(), 'board_ids', []));
    setFocusedBoardId(_.get(docSnap.data(), 'board_ids.0'));
  };

  useEffect(() => {
    fetchBoardIds(params.id);
  }, [params.id]);

  return (
    <div className="p-3">
      <div className="flex">
        <div className="w-20 h-full"></div>
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
