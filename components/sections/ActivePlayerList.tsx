'use client';

import { useCampaign } from '@/hooks/useCampaign';
import Image from 'next/image';
import _ from 'lodash';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ActivePlayerList = () => {
  const { campaign } = useCampaign();

  return (
    <div className="flex flex-col items-center mb-4">
      {_.map(campaign?.activePlayers, (player) => (
        <Tooltip key={player.uid}>
          <TooltipTrigger asChild>
            <Image
              height={40}
              width={40}
              src={player.photoURL || ''}
              alt={player.displayName || 'Unnamed user'}
              className="rounded-full mb-[-.5rem] border-black border-2"
            />
          </TooltipTrigger>
          <TooltipContent side="right">
            <h6 className="font-semibold">{player.displayName}</h6>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default ActivePlayerList;
