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
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';

import { UserSession } from '@/types/UserTypes';

const ActivePlayerList = () => {
  const { campaign } = useCampaign();
  const { user } = useUser();
  const { load } = useLoader();
  const [activePlayers, setActivePlayers] = useState<UserSession[]>([]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move

  useEffect(() => {
    if (campaign) {
      const playerDocRef = doc(db, 'campaigns', campaign.id);
      const unsubscribe = onSnapshot(playerDocRef, (playerDocSnap) => {
        if (playerDocSnap.exists()) {
          setActivePlayers(playerDocSnap.data().activePlayers);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [campaign]);

  useEffect(() => {
    if (campaign && user) {
      const player: UserSession = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };
      const playersDocRef = doc(db, 'campaigns', campaign.id);
      load(
        addPlayer(playersDocRef, player),
        'An error occurred when tracking your entry into the campaign. This should not affect your experience.'
      );

      return () => {
        removePlayer(playersDocRef, player);
      };
    }
  }, [user]);

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

  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );

  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  return (
    <div className="items-center justify-center  mb-10 w-full">
      {activePlayers.map((player, idx) => (
        <div
          className="-mr-4  relative group"
          key={player.displayName}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="wait">
            {hoveredIndex === idx && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: 'nowrap',
                }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px " />
                <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px " />
                <div className="font-bold text-white relative z-30 text-base">
                  {player.displayName}
                </div>
                <div className="text-white text-xs">{player.email}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <Image
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={player.photoURL || ''}
            alt={player.displayName || 'Unnamed user'}
            className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-white  relative transition duration-500"
          />
        </div>
      ))}
    </div>
  );
};

export default ActivePlayerList;
