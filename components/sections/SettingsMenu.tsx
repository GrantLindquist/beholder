'use client';

import CopyCampaignId from '@/components/misc/CopyCampaignId';
import ToggleFogOfWar from '@/components/misc/ToggleFogOfWar';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import { useCampaign } from '@/hooks/useCampaign';

const SettingsMenu = () => {
  const { focusedBoard } = useFocusedBoard();
  const { isUserDm } = useCampaign();

  console.log(isUserDm);

  return (
    <div className="space-y-2">
      {focusedBoard && isUserDm && <ToggleFogOfWar />}
      <CopyCampaignId />
    </div>
  );
};
export default SettingsMenu;
