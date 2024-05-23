'use client';

import { Switch } from '@/components/ui/switch';
import { SettingsEnum } from '@/types/CampaignTypes';
import { useSettings } from '@/hooks/useSettings';

const ToggleFogOfWar = () => {
  const { settings, toggleSetting } = useSettings();

  return (
    <>
      <div className="flex flex-row items-center">
        <label className="flex-grow">Toggle Fog of War</label>
        <Switch
          checked={settings?.fogOfWarEnabled}
          onCheckedChange={(checked) =>
            toggleSetting(SettingsEnum.FogOfWarEnabled, checked)
          }
        />
      </div>
    </>
  );
};
export default ToggleFogOfWar;
