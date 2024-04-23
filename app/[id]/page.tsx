'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Slider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CampaignPage = () => {
  const params = useParams();
  console.log(params);

  const [boardScale, setBoardScale] = useState(1);

  const handleMagnify = (_event: Event, newValue: number | number[]) => {
    setBoardScale(newValue as number);
  };

  return (
    <div className="p-3">
      <div className="flex">
        <div className="w-20 h-full"></div>
        <div className="w-full h-full flex items-center justify-center">
          {/*<GameBoard scale={boardScale} board_id={""}/>*/}
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
