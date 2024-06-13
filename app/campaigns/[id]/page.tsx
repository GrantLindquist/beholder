'use client';

import { useEffect, useState } from 'react';
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';
import db, { storage } from '@/app/firebase';
import { useCampaign } from '@/hooks/useCampaign';
import SideNavbar from '@/components/sections/SideNavbar';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import GameBoard from '@/components/board/GameBoard';
import { deleteObject, ref } from '@firebase/storage';
import { generateStorageRef } from '@/utils/uuid';
import { UserSession } from '@/types/UserTypes';
import { useUser } from '@/hooks/useUser';
import _ from 'lodash';
import { TransformWrapper } from 'react-zoom-pan-pinch';

const CampaignPage = ({ params }: { params: { id: string } }) => {
  const { campaign, setCampaignId } = useCampaign();
  const { user } = useUser();
  const { focusedBoard } = useFocusedBoard();

  const [disableBoardGestures, setDisableBoardGestures] = useState(false);

  useEffect(() => {
    setCampaignId(params.id);

    const addPlayer = async (player: UserSession) => {
      campaign &&
        (await updateDoc(doc(db, 'campaigns', campaign.id), {
          activePlayers: arrayUnion(player),
        }));
    };

    const removePlayer = async (player: UserSession) => {
      campaign &&
        (await updateDoc(doc(db, 'campaigns', campaign.id), {
          activePlayers: arrayRemove(player),
        }));
    };

    if (user) {
      const player: UserSession = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      addPlayer(player);
      return () => {
        removePlayer(player);
      };
    }
  }, [params.id]);

  const handleDeleteBoard = async (boardId: string) => {
    if (campaign && focusedBoard) {
      // Delete from game_boards
      const boardDocRef = doc(db, 'gameBoards', boardId);
      await deleteDoc(boardDocRef);

      // Delete id reference from campaign
      const campaignDocRef = doc(db, 'campaigns', campaign.id);
      await updateDoc(campaignDocRef, {
        boardIds: arrayRemove(boardId),
      });

      if (focusedBoard.backgroundImgURL) {
        await deleteObject(
          ref(
            storage,
            `board/${generateStorageRef(focusedBoard.title, boardId)}`
          )
        );
      }
    }
  };

  return (
    <div className="w-screen h-screen flex flex-row">
      {!_.isUndefined(campaign) ? (
        <>
          <SideNavbar />
          {!_.isNull(campaign) && (
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              {focusedBoard?.id ? (
                <TransformWrapper
                  minScale={0.5}
                  disabled={disableBoardGestures}
                >
                  <GameBoard
                    toggleBoardGestures={(toggle: boolean) =>
                      setDisableBoardGestures(toggle)
                    }
                  />
                </TransformWrapper>
              ) : (
                <p>There are no active boards for this campaign.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <p>This campaign does not exist.</p>
        </div>
      )}
    </div>
  );
};
export default CampaignPage;
