'use client';

import { useEffect, useState } from 'react';
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from '@firebase/firestore';
import db from '@/app/firebase';
import { useCampaign } from '@/hooks/useCampaign';
import { useUser } from '@/hooks/useUser';
import { useLoader } from '@/hooks/useLoader';
import Image from 'next/image';

import { UserSession } from '@/types/UserTypes';
import _ from 'lodash';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ActivePlayerList = () => {
  const { campaign } = useCampaign();
  const { user } = useUser();
  const { load } = useLoader();
  const [activePlayers, setActivePlayers] = useState<UserSession[]>([]);

  useEffect(() => {
    if (campaign && user) {
      const player: UserSession = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };
      const playerDocRef = doc(db, 'campaigns', campaign.id);
      load(
        addPlayer(playerDocRef, player),
        'An error occurred when tracking your entry into the campaign. This should not affect your experience.'
      );

      const unsubscribe = onSnapshot(playerDocRef, (playerDocSnap) => {
        if (playerDocSnap.exists()) {
          setActivePlayers(playerDocSnap.data().activePlayers);
        }
      });
      return () => {
        removePlayer(playerDocRef, player).then(() => unsubscribe());
      };
    }
  }, [campaign, user]);

  const addPlayer = async (ref: any, player: UserSession) => {
    user &&
      (await updateDoc(ref, {
        activePlayers: arrayUnion(player),
      }));
  };

  const removePlayer = async (ref: any, player: UserSession) => {
    user &&
      (await updateDoc(ref, {
        activePlayers: arrayRemove(player),
      }));
  };

  return (
    <div className="flex flex-col items-center mb-4">
      {_.map(activePlayers, (player) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              height={40}
              width={40}
              src={player.photoURL || ''}
              alt={player.displayName || 'Unnamed user'}
              className="rounded-full mb-[-.5rem] border-black border-2"
            />
          </TooltipTrigger>
          <TooltipContent side="right">
            <h6 className="font-semibold">{player.displayName}</h6>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default ActivePlayerList;
