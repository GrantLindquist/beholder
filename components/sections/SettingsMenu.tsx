'use client';

import CopyCampaignId from '@/components/misc/CopyCampaignId';
import ToggleFogOfWar from '@/components/misc/ToggleFogOfWar';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';

const SettingsMenu = () => {
  const { focusedBoard } = useFocusedBoard();

  return (
    <div className="space-y-2">
      {focusedBoard && <ToggleFogOfWar />}
      <CopyCampaignId />
    </div>
  );
};
export default SettingsMenu;
