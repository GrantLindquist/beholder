'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { CampaignType } from '@/types/GameBoardTypes';

const CampaignContext = createContext<{
  campaign: CampaignType | null;
  enterCampaign: (campaign: CampaignType, userId: string) => void;
  isUserDm: boolean | null;
}>({
  campaign: null,
  enterCampaign: (campaign: CampaignType, userId: string) =>
    console.error('Failed to initialize enterCampaign'),
  isUserDm: null,
});

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaign, setCampaign] = useState<CampaignType | null>(null);
  const [isUserDm, setIsUserDm] = useState<boolean | null>(null);

  const enterCampaign = (campaign: CampaignType, userId: string) => {
    setCampaign(campaign);
    userId === campaign.dm_id ? setIsUserDm(true) : setIsUserDm(false);
  };

  return (
    <CampaignContext.Provider value={{ campaign, enterCampaign, isUserDm }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context)
    throw new Error('useCampaign must be used inside CampaignProvider');
  return context;
};
