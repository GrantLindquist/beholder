'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { doc, onSnapshot, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import { useCampaign } from '@/hooks/useCampaign';
import { CampaignSettings, SettingsEnum } from '@/types/CampaignTypes';

const SettingsContext = createContext<{
  settings: CampaignSettings | null;
  toggleSetting: (key: SettingsEnum, toggle: boolean) => void;
}>({
  settings: null,
  toggleSetting: () => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { campaign } = useCampaign();

  const [settings, setSettings] = useState<CampaignSettings | null>(null);

  useEffect(() => {
    if (campaign) {
      const campaignDocRef = doc(db, 'campaigns', campaign.id);
      const unsubscribe = onSnapshot(campaignDocRef, (campaignDocSnap) => {
        if (campaignDocSnap.exists()) {
          setSettings(campaignDocSnap.data().settings);
        } else {
          console.error('The queried campaign does not exist.');
        }
      });
      // Cleanup
      return () => {
        unsubscribe();
      };
    }
  }, [campaign?.id]);

  const toggleSetting = async (key: SettingsEnum, toggle: boolean) => {
    if (campaign) {
      const campaignDocRef = doc(db, 'campaigns', campaign.id);
      await updateDoc(campaignDocRef, {
        settings: {
          ...settings,
          [key]: toggle,
        },
      });
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, toggleSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error('useSettings must be used inside SettingsProvider');
  return context;
};
