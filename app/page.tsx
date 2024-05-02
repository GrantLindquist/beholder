'use client';

import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@firebase/auth';
import db, { auth } from '@/app/firebase';
import { Button } from '@/components/ui/button';
import CampaignList from '@/components/sections/CampaignList';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { setUserSession } from '@/utils/userSession';
import { UserFunctional, UserSession } from '@/types/UserTypes';
import { UserContext } from '@/hooks/userContext';

export default function Home() {
  const user = useContext(UserContext).user;
  const [campaignIds, setCampaignIds] = useState<string[]>([]);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      // Add user to firestore if it does not exist
      .then(async (result) => {
        const user = result.user;
        const sessionUser: UserSession = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        };
        await setUserSession(sessionUser);

        const additionalUserInfo = getAdditionalUserInfo(result);
        if (_.get(additionalUserInfo, 'isNewUser')) {
          const userDoc = doc(db, 'users', user.uid);
          await setDoc(userDoc, {
            ...sessionUser,
            createdAt: Date.now(),
            campaigns: [],
          } as UserFunctional);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const fetchCampaignIds = async (userId: string) => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      setCampaignIds(_.get(docSnap.data(), 'campaigns', []));
    };
    if (user) {
      console.log(user);
      fetchCampaignIds(user.uid);
    }
  }, [user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? (
        <>
          <CampaignList campaignIds={campaignIds} />
          <Button variant="outline" onClick={handleSignOut}>
            Sign-out
          </Button>
        </>
      ) : (
        <Button variant="outline" onClick={handleSignIn}>
          Sign-in with Google
        </Button>
      )}
    </main>
  );
}
