import { useEffect, useState } from 'react';
import { doc, onSnapshot } from '@firebase/firestore';
import db from '@/app/firebase';
import { useCampaign } from '@/hooks/useCampaign';

const ActivePlayerList = () => {
  const { campaign } = useCampaign();
  const [activePlayerIds, setActivePlayerIds] = useState<string[]>();

  useEffect(() => {
    if (campaign) {
      const playerDocRef = doc(db, 'campaigns', campaign.id);
      const unsubscribe = onSnapshot(playerDocRef, (playerDocSnap) => {
        if (playerDocSnap.exists()) {
          setActivePlayerIds(playerDocSnap.data().activePlayerIds);
        } else {
          console.error('The queried player ids do not exist.');
        }
      });
      // Cleanup
      return () => {
        unsubscribe();
      };
    }
  }, [campaign]);

  // TODO: Make this pretty
  return (
    <>
      {/*{_.map(activePlayerIds, (id) => (*/}
      {/*  <p>{id}</p>*/}
      {/*))}*/}
    </>
  );
};
export default ActivePlayerList;
