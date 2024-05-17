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
import NextImage from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const CreateGameBoard = () => {
  const { campaign } = useCampaign();
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  // Width divided by height
  const [bgRatio, setBgRatio] = useState<number | null>(null);

  const form = useForm<z.infer<typeof createGameBoardSchema>>({
    resolver: zodResolver(createGameBoardSchema),
    defaultValues: {
      title: undefined,
      backgroundImg: undefined,
      width: DEFAULT_BOARD_SIZE,
      height: DEFAULT_BOARD_SIZE,
    },
  });

  const handleCreateBoard = async (
    values: z.infer<typeof createGameBoardSchema>
  ) => {
    // props.closeDropdownMenu();

    const newBoard: GameBoardType = {
      id: generateUUID(),
      title: values.title,
      width: values.width,
      height: values.height,
      activeTokens: [],
      ...(values.backgroundImg && { backgroundImgURL: values.backgroundImg }),
    };

    if (campaign) {
      // const boardDoc = doc(db, 'gameBoards', newBoard.id);
      // await setDoc(boardDoc, newBoard);
      //
      // const campaignRef = doc(db, 'campaigns', campaign.id);
      // await updateDoc(campaignRef, {
      //   boardIds: arrayUnion(newBoard.id),
      // });

      if (bgPreview) {
        // uploadToS3(bgPreview);
      }
    }
  };

  const handleUploadFile = (e: any) => {
    const img = new Image();
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setBgRatio(ratio);
      form.setValue('width', DEFAULT_BOARD_SIZE);
      form.setValue('height', Math.round(DEFAULT_BOARD_SIZE / ratio));
      setBgPreview(img.src);
    };
  };

  const handleChangeBgRatio = (field: 'width' | 'height') => {
    if (bgRatio) {
      if (field === 'width') {
        form.setValue('height', Math.round(form.getValues().width / bgRatio));
      } else if (field == 'height') {
        form.setValue('width', Math.round(form.getValues().height * bgRatio));
      }
    }
  };

  const handleToggleBgRatio = () => {
    if (bgRatio) {
      setBgRatio(null);
    } else {
      setBgRatio(form.getValues('width') / form.getValues('height'));
    }
  };

  // TODO: Remove ts-ignore and fix ts issue
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
                {/* @ts-ignore */}
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
                      handleChangeBgRatio(field.name);
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
                      handleChangeBgRatio(field.name);
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
            type="button"
            onClick={handleToggleBgRatio}
          >
            Link
          </Button>
        </div>
        {!bgRatio && bgPreview && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              The board width-height ratio is preset based on your selected
              image&apos;s dimensions. Changing it may manipulate your
              background image in unexpected ways.
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
export default CreateGameBoard;
