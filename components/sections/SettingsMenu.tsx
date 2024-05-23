'use client';

import CopyCampaignId from '@/components/misc/CopyCampaignId';
import { useSettings } from '@/hooks/useSettings';
import { Switch } from '@/components/ui/switch';
import { SettingsEnum } from '@/types/CampaignTypes';

const SettingsMenu = () => {
  const { settings, toggleSetting } = useSettings();

  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center">
        <label className="flex-grow">Toggle Fog of War</label>
        <Switch
          checked={settings?.fogOfWarEnabled}
          onCheckedChange={(checked) =>
            toggleSetting(SettingsEnum.FogOfWarEnabled, checked)
          }
        />
      </div>
      <CopyCampaignId />
    </div>
  );
};
export default SettingsMenu;
