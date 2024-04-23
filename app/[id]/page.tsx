'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GameBoard from '@/components/GameBoard';
import { doc, getDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import _ from 'lodash';

const CampaignPage = ({ params }: { params: { id: string } }) => {
  const [boardScale, setBoardScale] = useState(1);
  const [boardIds, setBoardIds] = useState<string[]>([]);

  const handleMagnify = (_event: Event, newValue: number | number[]) => {
    setBoardScale(newValue as number);
  };

  const fetchBoardIds = async (campaign_id: string) => {
    const docRef = doc(db, 'campaigns', campaign_id);
    const docSnap = await getDoc(docRef);
    setBoardIds(_.get(docSnap.data(), 'board_ids', []));
  };

  useEffect(() => {
    fetchBoardIds(params.id);
  }, [params.id]);

  return (
    <div className="p-3">
      <div className="flex">
        <div className="w-20 h-full"></div>
        <div className="w-full h-full flex items-center justify-center">
          <GameBoard scale={boardScale} boardIds={boardIds} />
        </div>
        <div className="w-20 h-full flex flex-col items-center">
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
        </div>
      </div>
    </div>
  );
};
export default CampaignPage;
