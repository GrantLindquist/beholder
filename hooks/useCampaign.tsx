'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { CampaignType } from '@/types/GameBoardTypes';
import { doc, getDoc } from '@firebase/firestore';
import db from '@/app/firebase';

const CampaignContext = createContext<{
  campaign: CampaignType | null;
  enterCampaign: (campaign: string, userId: string) => void;
  isUserDm: boolean | null;
}>({
  campaign: null,
  enterCampaign: (_campaign: string, _userId: string) =>
    console.error('Failed to initialize enterCampaign'),
  isUserDm: null,
});

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaign, setCampaign] = useState<CampaignType | null>(null);
  const [isUserDm, setIsUserDm] = useState<boolean | null>(null);

  const enterCampaign = async (campaignId: string, userId: string) => {
    const docRef = doc(db, 'campaigns', campaignId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setCampaign({
        id: docSnap.id,
        title: docSnap.data().title,
        boardIds: docSnap.data().boardIds,
        dmId: docSnap.data().dmId,
        playerIds: docSnap.data().playerIds,
      });
      userId === docSnap.data().dmId ? setIsUserDm(true) : setIsUserDm(false);
    } else {
      console.error(
        'Encountered issue while trying to load campaign of id: ' + campaignId
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
