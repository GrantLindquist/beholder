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
  campaign: CampaignType | null | undefined;
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

  const [campaign, setCampaign] = useState<CampaignType | null | undefined>(
    null
  );
  const [campaignId, setCampaignId] = useState<string | null>(null);

  const [isUserDm, setIsUserDm] = useState<boolean | null>(null);

  useEffect(() => {
    if (campaignId && user) {
      try {
        const unsubscribe = onSnapshot(
          doc(db, 'campaigns', campaignId),
          (docSnap) => {
            if (docSnap.exists()) {
              setCampaign(docSnap.data() as CampaignType);
              setIsUserDm(docSnap.data().dmId === user.uid);
            } else {
              setCampaign(undefined);
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
  }, [campaignId, user]);

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
