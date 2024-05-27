'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useLoader } from '@/hooks/useLoader';
import { arrayUnion, doc, getDoc, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import InfoTooltip from '@/components/misc/InfoTooltip';

const JoinCampaign = () => {
  const { load } = useLoader();
  const { user } = useUser();
  const router = useRouter();

  const [displayMessage, setDisplayMessage] = useState<string | null>(null);

  const handleJoinCampaign = async (event: any) => {
    event.preventDefault();
    displayMessage && setDisplayMessage(null);
    const campaignId = event.target[0].value;
    if (user && campaignId) {
      const userDocRef = doc(db, 'users', user.uid);
      const campaignDocRef = doc(db, 'campaigns', campaignId);
      const campaignDocSnap = await getDoc(campaignDocRef);

      if (campaignDocSnap.exists()) {
        await updateDoc(campaignDocRef, {
          playerIds: arrayUnion(user.uid),
        });
        await updateDoc(userDocRef, {
          campaigns: arrayUnion(campaignId),
        });
        router.push(`campaigns/${campaignId}`);
      } else {
        setDisplayMessage('That campaign does not exist.');
      }
    }
  };

  return (
    <div className="flex flex-row items-center space-x-2 mx-2">
      <InfoTooltip
        description={
          <p>
            This can be found by going to{' '}
            <strong>{`Settings > Campaign Id`}</strong> within your desired
            campaign.
          </p>
        }
      />
      <form
        onSubmit={(event) =>
          load(
            handleJoinCampaign(event),
            'An error occurred while joining that campaign.'
          )
        }
        className="m-2"
      >
        <div className="flex flex-row items-center space-x-2">
          <Input placeholder="Campaign Id" />
          <Button type="submit">Submit</Button>
        </div>

        <p className="text-xs mt-1 text-red-600">{displayMessage}</p>
      </form>
    </div>
  );
};
export default JoinCampaign;
