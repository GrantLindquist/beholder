import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useCampaign } from '@/hooks/useCampaign';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createGameBoardSchema } from '@/types/FormSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_BOARD_SIZE } from '@/app/globals';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { generateUUID } from '@/utils/uuid';
import { GameBoardType } from '@/types/GameBoardTypes';
import { arrayUnion, doc, setDoc, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import NextImage from 'next/image';

const CreateGameBoard = () => {
  const { campaign } = useCampaign();
  const [bgPreview, setBgPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof createGameBoardSchema>>({
    resolver: zodResolver(createGameBoardSchema),
    defaultValues: {
      title: '',
      backgroundImg: undefined,
      width: DEFAULT_BOARD_SIZE,
      height: DEFAULT_BOARD_SIZE,
    },
  });

  const handleCreateBoard = async (
    values: z.infer<typeof createGameBoardSchema>
  ) => {
    const newBoard: GameBoardType = {
      id: generateUUID(),
      title: values.title,
      width: values.width,
      height: values.height,
      backgroundImgURL: values.backgroundImg,
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
  };

  function handleUploadFile(e: any) {
    const img = new Image();
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = () => {
      console.log(`Image dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
    };
    setBgPreview(img.src);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateBoard)}
        className="space-y-1"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="backgroundImg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Image</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {bgPreview && (
          <NextImage
            src={bgPreview}
            width={100}
            height={100}
            alt="Background Image Preview"
          />
        )}
        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Width</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
export default CreateGameBoard;
