'use client';

import { Switch } from '@/components/ui/switch';
import { SettingsEnum } from '@/types/GameBoardTypes';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';

const ToggleFogOfWar = () => {
  const { focusedBoard, toggleSetting } = useFocusedBoard();

  return (
    <>
      <div className="flex flex-row items-center">
        <label className="flex-grow">Toggle Fog of War</label>
        <Switch
          checked={focusedBoard?.settings?.fowEnabled}
          onCheckedChange={(checked) =>
            toggleSetting(SettingsEnum.FowEnabled, checked)
          }
        />
      </div>
    </>
  );
};
export default ToggleFogOfWar;
