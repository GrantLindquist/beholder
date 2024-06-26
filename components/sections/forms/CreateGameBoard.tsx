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
import { generateStorageRef, generateUUID } from '@/utils/uuid';
import { GameBoardType } from '@/types/GameBoardTypes';
import NextImage from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import db, { storage } from '@/app/firebase';
import { arrayUnion, doc, setDoc, updateDoc } from '@firebase/firestore';
import { Link } from 'lucide-react';
import { getDefaultFowMatrix } from '@/utils/fow';
import { useLoader } from '@/hooks/useLoader';

const CreateGameBoard = () => {
  const { campaign } = useCampaign();
  const { load } = useLoader();
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState(null);
  // Width divided by height
  const [bgRatio, setBgRatio] = useState<number | null>(null);

  const form = useForm<z.infer<typeof createGameBoardSchema>>({
    resolver: zodResolver(createGameBoardSchema),
    defaultValues: {
      title: undefined,
      backgroundImg: null,
      width: DEFAULT_BOARD_SIZE,
      height: DEFAULT_BOARD_SIZE,
    },
  });

  const handleCreateBoard = async (
    values: z.infer<typeof createGameBoardSchema>
  ) => {
    // props.closeDropdownMenu();

    let backgroundImgURL = null;
    const id = generateUUID();

    if (bgImage) {
      const imageRef = ref(
        storage,
        `board/${generateStorageRef(values.title, id)}`
      );
      await uploadBytes(imageRef, bgImage);
      backgroundImgURL = await getDownloadURL(imageRef);
    }

    const newBoard: GameBoardType = {
      id: id,
      title: values.title,
      width: values.width,
      height: values.height,
      activeTokens: [],
      backgroundImgURL: backgroundImgURL,
      fowCells: getDefaultFowMatrix(values.width, values.height),
      settings: {
        fowEnabled: false,
      },
    };

    if (campaign) {
      const boardDoc = doc(db, 'gameBoards', newBoard.id);
      await setDoc(boardDoc, newBoard);

      const campaignRef = doc(db, 'campaigns', campaign.id);
      await updateDoc(campaignRef, {
        boardIds: arrayUnion(newBoard.id),
        ...(campaign.focusedBoardId ? {} : { focusedBoardId: newBoard.id }),
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
      form.setValue('height', Math.round(DEFAULT_BOARD_SIZE / ratio));
      setBgPreview(img.src);
      setBgImage(e.target.files[0]);
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

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          load(
            handleCreateBoard(form.getValues()),
            'An error occurred while creating your board.'
          );
        }}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input
                  type="file"
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
            variant="ghost"
            type="button"
            onClick={handleToggleBgRatio}
            className={`size-9 ${bgRatio ? 'bg-gray-800' : ''}`}
          >
            <Link size={16} />
          </Button>
        </div>
        {!bgRatio && bgPreview && (
          <Alert variant="warning">
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
