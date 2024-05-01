'use client';

import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from '@firebase/auth';
import db, { auth } from '@/app/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '@/components/ui/button';
import CampaignList from '@/components/sections/CampaignList';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import _ from 'lodash';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user] = useAuthState(auth);
  const [campaignIds, setCampaignIds] = useState<string[]>([]);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      // Add user to firestore if it does not exist
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        console.log(credential);
        console.log(token);

        const user = result.user;
        const additionalUserInfo = getAdditionalUserInfo(result);
        if (_.get(additionalUserInfo, 'isNewUser')) {
          const userDoc = doc(db, 'users', user.uid);
          await setDoc(userDoc, {
            campaigns: [],
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchCampaignIds = async (user_id: string) => {
      const docRef = doc(db, 'users', user_id);
      const docSnap = await getDoc(docRef);
      setCampaignIds(_.get(docSnap.data(), 'campaigns', []));
    };
    if (user) {
      fetchCampaignIds(user.uid);
    }
  }, [user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? (
        <CampaignList campaignIds={campaignIds} />
      ) : (
        <Button variant="outline" onClick={handleSignIn}>
          Sign-in with Google
        </Button>
      )}
    </main>
  );
}
