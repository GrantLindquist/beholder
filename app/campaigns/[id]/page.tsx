'use client';

import { useEffect, useState } from 'react';
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
import SideNavbar from '@/components/sections/SideNavbar';
import { useFocusedBoard } from '@/hooks/useFocusedBoard';
import GameBoard from '@/components/board/GameBoard';
import { useUser } from '@/hooks/useUser';
import { useLoader } from '@/hooks/useLoader';
import { SearchIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const CampaignPage = ({ params }: { params: { id: string } }) => {
  const { load } = useLoader();
  const { user } = useUser();
  const { campaign, enterCampaign } = useCampaign();
  const { focusedBoard, setFocusedBoardId } = useFocusedBoard();

  const [boardScale, setBoardScale] = useState(1);

  useEffect(() => {
    const initializeCampaign = async () => {
      user?.uid && enterCampaign(params.id, user.uid);
    };
    load(
      initializeCampaign(),
      'An error occurred while entering your campaign'
    );
  }, [params.id, user]);

  useEffect(() => {
    const fetchDefaultBoardId = async () => {
      if (campaign) {
        const campaignDocRef = doc(db, 'campaigns', campaign.id);
        const campaignDocSnap = await getDoc(campaignDocRef);
        if (campaignDocSnap.exists()) {
          setFocusedBoardId(_.get(campaignDocSnap.data(), 'boardIds.0', null));
        }
      }
    };
    load(
      fetchDefaultBoardId(),
      'An error occurred while loading your current game board.'
    );
  }, [campaign]);

  const handleMagnify = (newValue: number[]) => {
    setBoardScale(newValue[0]);
  };

  // TODO: Delete applicable bgImage from cloud storage
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
              <p>There are no active boards for this campaign.</p>
            )}
          </div>
          <div className="w-20 h-full flex flex-col items-center">
            {focusedBoard?.id && (
              <>
                <SearchIcon />
                <Slider
                  defaultValue={[1]}
                  min={0.3}
                  max={3}
                  step={0.0001}
                  onValueChange={handleMagnify}
                />
                <Button
                  variant={'destructive'}
                  onClick={() => handleDeleteBoard(focusedBoard.id)}
                  className="relative bottom-0"
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
