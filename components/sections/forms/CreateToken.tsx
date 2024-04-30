import { Button } from '@/components/ui/button';
import { FormEvent, useState } from 'react';
import { GameBoardToken } from '@/types/GameBoardTypes';
import { doc, setDoc } from '@firebase/firestore';
import db, { auth } from '@/app/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { generateUUID } from '@/utils/uuid';
import { uploadToS3 } from '@/utils/s3';

const CreateToken = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [user] = useAuthState(auth);

  const handleCreateToken = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      console.error('An unauthenticated user cannot create tokens.');
      return;
    }

    // @ts-ignore
    const title = event.target[0].value;

    // @ts-ignore
    const image = event.target[1].files[0];
    if (image) {
      await uploadToS3(image);
    }

    const newToken: GameBoardToken = {
      id: generateUUID(),
      title: title,
      ownerId: user.uid,
    };

    const docRef = doc(db, 'tokens', newToken.id);
    await setDoc(docRef, newToken);

    setDialogOpen(false);
  };

  // TODO: Accept prop can be bypassed, ensure that users can only upload png/jpeg as avatar
  return (
    <form onSubmit={handleCreateToken}>
      <div className="form-control">
        <label>Title</label>
        <input type="text" className="input input-bordered" />
      </div>
      <div className="form-control">
        <label>Avatar</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="input input-bordered"
        />
      </div>
      <Button type="submit" variant={'outline'}>
        Create
      </Button>
    </form>
  );
};
export default CreateToken;
