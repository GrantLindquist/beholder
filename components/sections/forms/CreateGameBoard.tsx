import { Button } from '@/components/ui/button';
import { FormEvent, useState } from 'react';
import { GameBoardType } from '@/types/GameBoardTypes';
import { arrayUnion, doc, setDoc, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import { useCampaign } from '@/hooks/useCampaign';
import { generateUUID } from '@/utils/uuid';

const CreateGameBoard = () => {
  const { campaign } = useCampaign();
  const [isDialogOpen, setDialogOpen] = useState(false);

  // TODO: Use a better form solution
  const handleCreateBoard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // @ts-ignore
    const title = event.target[0].value;
    // @ts-ignore
    const height = event.target[1].value;
    // @ts-ignore
    const width = event.target[2].value;

    const newBoard: GameBoardType = {
      id: generateUUID(),
      title: title,
      height: height,
      width: width,
      activeTokens: [],
    };

    if (campaign) {
      const boardDoc = doc(db, 'gameBoards', newBoard.id);
      await setDoc(boardDoc, newBoard);

      const campaignRef = doc(db, 'campaigns', campaign.id);
      await updateDoc(campaignRef, {
        boardIds: arrayUnion(newBoard.id),
      });
    }

    setDialogOpen(false);
  };

  return (
    <form onSubmit={handleCreateBoard}>
      <div className="form-control">
        <label>Title</label>
        <input type="text" className="input input-bordered" />
      </div>
      <div className="form-control">
        <label>Background</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="input input-bordered"
        />
      </div>
      <div className="form-control">
        <label>Width</label>
        <input type="number" className="input input-bordered" />
      </div>
      <div className="form-control">
        <label>Height</label>
        <input type="number" className="input input-bordered" />
      </div>
      <Button type="submit" variant={'outline'}>
        Create
      </Button>
    </form>
  );
};
export default CreateGameBoard;
