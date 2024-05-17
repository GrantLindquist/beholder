import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { GameBoardToken } from '@/types/GameBoardTypes';
import { doc, setDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import { generateUUID } from '@/utils/uuid';
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
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/useUser';

const CreateToken = () => {
  const { user } = useUser();
  const { toast } = useToast();

  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof createTokenSchema>>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      title: '',
      tokenImg: undefined,
    },
  });

  // TODO: Revise handleCreateToken to use useLoader
  const handleCreateToken = async (
    values: z.infer<typeof createTokenSchema>
  ) => {
    try {
      if (!user) {
        console.error('An unauthenticated user cannot create tokens.');
        return;
      }

      const newToken: GameBoardToken = {
        id: generateUUID(),
        title: values.title,
        tokenImgURL: values.tokenImg,
        ownerId: user.uid,
      };

      const docRef = doc(db, 'tokens', newToken.id);
      await setDoc(docRef, newToken);

      if (imgPreview) {
        //uploadToS3
        console.log(imgPreview);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: 'Critical Fail',
        description: 'An error occurred while creating your token.',
      });
    }
  };

  // TODO: Accept prop can be bypassed, ensure that users can only upload png/jpeg as avatar
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateToken)}
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
          name="tokenImg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Image</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {imgPreview && (
          <NextImage
            src={imgPreview}
            width={100}
            height={100}
            alt="Background Image Preview"
          />
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
export default CreateToken;
