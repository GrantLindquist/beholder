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
import { CELL_SIZE } from '@/app/globals';
import { useFow } from '@/hooks/useFow';

// TODO: Display campaign title as head title
const CampaignPage = ({ params }: { params: { id: string } }) => {
  const { campaign, setCampaignId } = useCampaign();
  const { user } = useUser();
  const { eraseFow } = useFow();
  const { focusedBoard, movingToken } = useFocusedBoard();

  const [disableBoardGestures, setDisableBoardGestures] = useState(false);
  const [initialBoardScale, setInitialBoardScale] = useState(1);
  const [minBoardScale, setMinBoardScale] = useState(0.01);
  const [maxBoardScale, setMaxBoardScale] = useState(2);

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

  // TODO: Tweak this
  // Dynamically set game board min/max/initial scales
  useEffect(() => {
    if (focusedBoard) {
      // '200' is used to add 200px of padding to the default scale as to not completely cover screen w/ board
      const weightedWidth =
        (window.innerWidth - 200) / (focusedBoard.width * CELL_SIZE);
      const weightedHeight =
        (window.innerHeight - 200) / (focusedBoard.height * CELL_SIZE);

      if (weightedWidth > weightedHeight) {
        setInitialBoardScale(weightedHeight);
        setMinBoardScale(weightedHeight / 3);
        setMaxBoardScale(weightedHeight * 3);
        console.log(weightedHeight);
      } else {
        console.log(weightedWidth);
        setInitialBoardScale(weightedWidth);
        setMinBoardScale(weightedWidth / 3);
        setMaxBoardScale(weightedWidth * 3);
      }
    }
  }, [focusedBoard?.width, focusedBoard?.height]);

  useEffect(() => {
    const gestureToggle = !_.isNull(movingToken);
    disableBoardGestures !== gestureToggle &&
      setDisableBoardGestures(gestureToggle);
  }, [movingToken]);

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
                  minScale={minBoardScale}
                  maxScale={maxBoardScale}
                  initialScale={initialBoardScale}
                  disabled={disableBoardGestures || !_.isNull(eraseFow)}
                  // -40px is necessary to center board because of side navbar offset (sidenav width is 80px)
                  initialPositionX={
                    window.innerWidth / 2 -
                    (focusedBoard.width * CELL_SIZE) / 2 -
                    40
                  }
                  initialPositionY={
                    window.innerHeight / 2 -
                    (focusedBoard.height * CELL_SIZE) / 2
                  }
                >
                  <GameBoard />
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
