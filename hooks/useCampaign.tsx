'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CampaignType } from '@/types/CampaignTypes';
import { doc, onSnapshot } from '@firebase/firestore';
import db from '@/app/firebase';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/useUser';

const CampaignContext = createContext<{
  campaign: CampaignType | null;
  setCampaignId: Dispatch<SetStateAction<string | null>>;
  isUserDm: boolean | null;
}>({
  campaign: null,
  setCampaignId: () => {},
  isUserDm: null,
});

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useUser();

  const [campaign, setCampaign] = useState<CampaignType | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  const [isUserDm, setIsUserDm] = useState<boolean | null>(null);

  console.log(campaign);

  useEffect(() => {
    // TODO: There's an anti-pattern here - campaignId or user not existing is worthy of error UI, yet it is swallowed. Keep in mind that id should be null while loading, do not cause that functionality to break
    if (campaignId) {
      try {
        const unsubscribe = onSnapshot(
          doc(db, 'campaigns', campaignId),
          (docSnap) => {
            if (docSnap.exists()) {
              setCampaign(docSnap.data() as CampaignType);
              setIsUserDm(docSnap.data().dmId === user?.uid);
            } else {
              console.error('The queried campaign does not exist.');
            }
          }
        );
        // Cleanup
        return () => {
          unsubscribe();
        };
      } catch (e: any) {
        toast({
          title: 'Critical Fail',
          description: e.message,
        });
      }
    }
  }, [campaignId]);

  return (
    <CampaignContext.Provider value={{ campaign, setCampaignId, isUserDm }}>
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
