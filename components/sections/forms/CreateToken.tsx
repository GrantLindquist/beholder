import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { GameBoardToken } from '@/types/GameBoardTypes';
import { doc, setDoc } from '@firebase/firestore';
import db, { storage } from '@/app/firebase';
import { generateStorageRef, generateUUID } from '@/utils/uuid';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTokenSchema } from '@/types/FormSchemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import NextImage from 'next/image';
import { useUser } from '@/hooks/useUser';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { useCampaign } from '@/hooks/useCampaign';
import { Switch } from '@/components/ui/switch';
import InfoTooltip from '@/components/misc/InfoTooltip';
import { useLoader } from '@/hooks/useLoader';

const CreateToken = () => {
  const { user } = useUser();
  const { isUserDm } = useCampaign();
  const { load } = useLoader();
  const [tokenImage, setTokenImage] = useState(null);
  const [tokenImgPreview, setTokenImgPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof createTokenSchema>>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      title: '',
      tokenImg: null,
      isMonster: isUserDm || false,
    },
  });

  // TODO: Revise handleCreateToken to use useLoader
  const handleCreateToken = async (
    values: z.infer<typeof createTokenSchema>
  ) => {
    if (!user) {
      return;
    }

    let tokenImgURL = null;
    const id = generateUUID();

    if (tokenImage) {
      const imageRef = ref(
        storage,
        `token/${generateStorageRef(values.title, id)}`
      );
      await uploadBytes(imageRef, tokenImage);
      tokenImgURL = await getDownloadURL(imageRef);
    }

    const newToken: GameBoardToken = {
      id: id,
      title: values.title,
      tokenImgURL: tokenImgURL,
      ownerId: user.uid,
      isMonster: values.isMonster,
      lastPlacedAt: Date.now(),
    };

    const docRef = doc(db, 'tokens', newToken.id);
    await setDoc(docRef, newToken);
  };

  const handleUploadFile = (e: any) => {
    const img = new Image();
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = () => {
      setTokenImgPreview(img.src);
      setTokenImage(e.target.files[0]);
    };
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          load(
            handleCreateToken(form.getValues()),
            'An error occurred while creating your token.'
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
          name="tokenImg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Image</FormLabel>
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
        {tokenImgPreview && (
          <NextImage
            src={tokenImgPreview}
            width={100}
            height={100}
            alt="Token Image Preview"
          />
        )}
        {isUserDm && (
          <FormField
            control={form.control}
            name="isMonster"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center">
                  <div className="flex items-center space-x-1 flex-grow">
                    <FormLabel>Is Monster?</FormLabel>
                    <InfoTooltip
                      description={`A "Monster" token can be duplicated on the board.`}
                    />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
export default CreateToken;
