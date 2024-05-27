'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { CampaignType } from '@/types/CampaignTypes';
import { doc, getDoc } from '@firebase/firestore';
import db from '@/app/firebase';

const CampaignContext = createContext<{
  campaign: CampaignType | null;
  enterCampaign: (campaign: string, userId: string) => void;
  isUserDm: boolean | null;
}>({
  campaign: null,
  enterCampaign: () => {},
  isUserDm: null,
});

// TODO: Setup a live listener here and remove listeners from non-hooks
export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaign, setCampaign] = useState<CampaignType | null>(null);
  const [isUserDm, setIsUserDm] = useState<boolean | null>(null);

  const enterCampaign = async (campaignId: string, userId: string) => {
    const campaignDocRef = doc(db, 'campaigns', campaignId);
    const campaignDocSnap = await getDoc(campaignDocRef);

    // TODO: Use toasts here
    if (
      campaignDocSnap.exists() &&
      campaignDocSnap.data().playerIds.includes(userId)
    ) {
      setCampaign({
        id: campaignDocSnap.id,
        title: campaignDocSnap.data().title,
        boardIds: campaignDocSnap.data().boardIds,
        dmId: campaignDocSnap.data().dmId,
        playerIds: campaignDocSnap.data().playerIds,
      });
      userId === campaignDocSnap.data().dmId
        ? setIsUserDm(true)
        : setIsUserDm(false);
    } else {
      console.error(
        `Encountered issue while trying to load campaign of id ` + campaignId
      );
    }
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
