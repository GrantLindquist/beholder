import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormEvent, useState } from 'react';
import { GameBoardCellType, GameBoardType } from '@/types/GameBoardTypes';
import { arrayUnion, doc, setDoc, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import { useCampaign } from '@/hooks/useCampaign';

const CreateGameBoardDialog = () => {
  const { campaign } = useCampaign();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleCreateBoard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // @ts-ignore
    const title = event.target[0].value;
    // @ts-ignore
    const height = event.target[1].value;
    // @ts-ignore
    const width = event.target[2].value;

    const cells: GameBoardCellType[] = [];
    for (let i = 0; i < height * width; i++) {
      cells.push({
        occupants: [],
      });
    }

    const newBoard: GameBoardType = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      title: title,
      height: height,
      width: width,
      cells: cells,
    };

    if (campaign) {
      const boardDoc = doc(db, 'game_boards', newBoard.id);
      await setDoc(boardDoc, newBoard);

      const campaignRef = doc(db, 'campaigns', campaign.id);
      await updateDoc(campaignRef, {
        board_ids: arrayUnion(newBoard.id),
      });
    }

    setDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen}>
      <DialogTrigger onClick={() => setDialogOpen(true)}>
        Create Board
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleCreateBoard}>
              <div className="form-control">
                <input type="text" className="input input-bordered" />
              </div>
              <div className="form-control">
                <input type="number" className="input input-bordered" />
              </div>
              <div className="form-control">
                <input type="number" className="input input-bordered" />
              </div>
              <Button type="submit" variant={'outline'}>
                Create
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreateGameBoardDialog;
