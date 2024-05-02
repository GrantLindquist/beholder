'use client';

import { useContext, useEffect, useState } from 'react';
import {
  arrayRemove,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from '@firebase/firestore';
import db from '@/app/firebase';
import _ from 'lodash';
import { useCampaign } from '@/hooks/useCampaign';
import { Button } from '@/components/ui/button';
import SideNavbar from '@/components/sections/SideNavbar';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import GameBoard from '@/components/board/GameBoard';
import { getUserFromSession } from '@/utils/userSession';
import { UserContext } from '@/hooks/userContext';

const CampaignPage = ({ params }: { params: { id: string } }) => {
  const [boardScale, setBoardScale] = useState(1);

  const { campaign, enterCampaign, isUserDm } = useCampaign();
  const { focusedBoard, setFocusedBoardId } = useFocusedBoard();
  const user = useContext(UserContext).user;

  // TODO: Use loading states while fetching promises
  useEffect(() => {
    enterCampaign(params.id, _.get(user, 'uid', ''));
  }, [params.id]);

  useEffect(() => {
    const fetchDefaultBoardId = async () => {
      console.log(await getUserFromSession());
      if (campaign) {
        const campaignDocRef = doc(db, 'campaigns', campaign.id);
        const campaignDocSnap = await getDoc(campaignDocRef);
        if (campaignDocSnap.exists()) {
          setFocusedBoardId(_.get(campaignDocSnap.data(), 'boardIds.0', null));
        }
      }
    };
    fetchDefaultBoardId();
  }, [campaign]);

  const handleMagnify = (_event: Event, newValue: number | number[]) => {
    setBoardScale(newValue as number);
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (campaign) {
      // Delete from game_boards
      const boardDocRef = doc(db, 'gameBoards', boardId);
      await deleteDoc(boardDocRef);

      // Delete id reference from campaign
      const campaignDocRef = doc(db, 'campaigns', campaign.id);
      await updateDoc(campaignDocRef, {
        boardIds: arrayRemove(boardId),
      });
    }
  };

  return (
    <>
      {campaign ? (
        <div className="flex">
          <SideNavbar />
          <div className="w-full h-full flex items-center justify-center">
            {focusedBoard?.id ? (
              <>
                <GameBoard scale={boardScale} boardId={focusedBoard.id} />
              </>
            ) : (
              <>
                <p>There are no active boards for this campaign.</p>
                {/*{isUserDm && <CreateGameBoard />}*/}
              </>
            )}
          </div>
          <div className="w-20 h-full flex flex-col items-center">
            {focusedBoard?.id && (
              <>
                {/*<SearchIcon />*/}
                {/*<Slider*/}
                {/*  sx={{*/}
                {/*    height: 100,*/}
                {/*  }}*/}
                {/*  orientation={'vertical'}*/}
                {/*  value={boardScale}*/}
                {/*  onChange={handleMagnify}*/}
                {/*  defaultValue={1}*/}
                {/*  min={0.3}*/}
                {/*  max={3}*/}
                {/*  step={0.0001}*/}
                {/*/>*/}
                <Button
                  variant={'destructive'}
                  onClick={() => handleDeleteBoard(focusedBoard.id)}
                >
                  Delete Board
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>This campaign does not exist.</p>
      )}
    </>
  );
};
export default CampaignPage;
