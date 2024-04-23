'use client';

import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from '@firebase/auth';
import db, { auth } from '@/app/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '@/components/ui/button';
import CampaignList from '@/components/CampaignList';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import _ from 'lodash';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      // Add user to firestore if it does not exist
      .then(async (result) => {
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

  const fetchCampaigns = async (user_id: string) => {
    let campaigns = [];

    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const campaign_ids = _.get(docSnap.data(), 'campaigns', []);

      for (let id of campaign_ids) {
        const docRef = doc(db, 'campaigns', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          campaigns.push(docSnap.data());
        } else {
          console.error(
            'Encountered issue while trying to load campaign of id: ' + id
          );
        }
      }
    } else {
      console.error(
        'Attempting to find campaigns for a user who does not exist'
      );
    }

    setCampaigns(campaigns);
  };

  useEffect(() => {
    if (user) {
      fetchCampaigns(user.uid);
    }
  }, [user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? (
        <CampaignList campaigns={campaigns} />
      ) : (
        <Button variant="outline" onClick={handleSignIn}>
          Sign-in with Google
        </Button>
      )}
    </main>
  );
}
