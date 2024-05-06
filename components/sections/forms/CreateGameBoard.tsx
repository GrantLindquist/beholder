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
import { useToast } from '@/components/ui/use-toast';

const CreateGameBoard = () => {
  const { campaign } = useCampaign();
  const { toast } = useToast();
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  // Width divided by height
  const [bgRatio, setBgRatio] = useState<number | null>(null);

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
    try {
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

        if (bgPreview) {
          //uploadToS3
          console.log(bgPreview);
        }
      }
    } catch (e) {
      console.error(e);
      toast({
        title: 'Critical Fail',
        description: 'An error occurred while creating your board.',
      });
    }
  };

  const handleUploadFile = (e: any) => {
    const img = new Image();
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setBgRatio(ratio);
      form.setValue('width', DEFAULT_BOARD_SIZE);
      form.setValue('height', DEFAULT_BOARD_SIZE / ratio);
    };
    setBgPreview(img.src);
  };

  const handleRatio = (field: 'width' | 'height') => {
    if (bgRatio) {
      if (field === 'width') {
        form.setValue('height', Math.round(form.getValues().width / bgRatio));
      } else if (field == 'height') {
        form.setValue('width', Math.round(form.getValues().height * bgRatio));
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateBoard)}
        className="space-y-1 p-4"
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
                <input
                  type="file"
                  placeholder="shadcn"
                  accept=".jpg, .jpeg, .png"
                  {...field}
                  onChange={handleUploadFile}
                />
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
        <div className="flex flex-row items-end gap-4">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="shadcn"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleRatio(field.name);
                    }}
                  />
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
                  <Input
                    type="number"
                    placeholder="shadcn"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleRatio(field.name);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size="icon"
            variant={bgRatio ? 'outline' : 'ghost'}
            // onClick={() => setForceRatio(!forceRatio)}
          >
            Link
          </Button>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
export default CreateGameBoard;
