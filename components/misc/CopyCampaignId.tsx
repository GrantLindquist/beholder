'use client';

import { useCampaign } from '@/hooks/useCampaign';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Check, Clipboard as ClipboardIcon } from 'lucide-react';
import InfoTooltip from '@/components/misc/InfoTooltip';

const CopyCampaignId = () => {
  const { campaign } = useCampaign();

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyCampaignId = async () => {
    campaign?.id && (await navigator.clipboard.writeText(campaign.id));
    setIsCopied(true);
  };

  return (
    <>
      <div className="flex items-center space-x-1 my-1">
        <label className="text-xs">Campaign Id</label>
        <InfoTooltip
          description={`A player may enter this ID into the "Join Campaign" dialog to join this campaign.`}
        />
      </div>

      <div className="flex flex-row items-center bg-gray-800 rounded">
        <p className="flex-grow text-xs font-mono mx-4">
          {campaign?.id || 'N/A'}
        </p>
        <Button variant="ghost" onClick={handleCopyCampaignId}>
          {isCopied ? <Check size={16} /> : <ClipboardIcon size={16} />}
        </Button>
      </div>
      {isCopied && <p className="text-xs">Copied!</p>}
    </>
  );
};
export default CopyCampaignId;
