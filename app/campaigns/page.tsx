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
import { useEffect, useState } from 'react';
import { setUserSession } from '@/utils/userSession';
import { UserFunctional, UserSession } from '@/types/UserTypes';
import { useUser } from '@/hooks/useUser';
import { useLoader } from '@/hooks/useLoader';

export default function Campaigns() {
  const { user } = useUser();
  const { load } = useLoader();

  const [campaignIds, setCampaignIds] = useState<string[]>([]);

  const handleSignIn = async () => {
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
      load(
        fetchCampaignIds(user.uid),
        'An error occurred while loading your campaigns.'
      );
    }
  }, [user]);

  // TODO: Investigate bug where sign-in page does not change after sign in
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? (
        <>
          <CampaignList campaignIds={campaignIds} />
          <div className="flex flex-row gap-4">
            <Button variant="outline">Join Campaign</Button>
            <Button variant="outline">Create Campaign</Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign-out
            </Button>
          </div>
        </>
      ) : (
        <Button
          variant="outline"
          onClick={() =>
            load(handleSignIn(), 'An error occurred while signing into Google.')
          }
        >
          Sign-in with Google
        </Button>
      )}
    </main>
  );
}
