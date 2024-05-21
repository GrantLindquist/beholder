'use client';

import { useCampaign } from '@/hooks/useCampaign';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Check, Clipboard as ClipboardIcon } from 'lucide-react';

const SettingsMenu = () => {
  const { campaign } = useCampaign();

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyCampaignId = async () => {
    campaign?.id && (await navigator.clipboard.writeText(campaign.id));
    setIsCopied(true);
  };

  return (
    <>
      <label className="text-xs">Campaign Id</label>
      <div className="flex flex-row items-center bg-gray-800 rounded">
        <p className="flex-grow text-xs mx-4">{campaign?.id || 'N/A'}</p>
        <Button variant="ghost" onClick={handleCopyCampaignId}>
          {isCopied ? <Check size={16} /> : <ClipboardIcon size={16} />}
        </Button>
      </div>
    </>
  );
};
export default SettingsMenu;
