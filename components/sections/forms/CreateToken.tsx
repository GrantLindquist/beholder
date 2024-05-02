import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { GameBoardToken } from '@/types/GameBoardTypes';
import { doc, setDoc } from '@firebase/firestore';
import db from '@/app/firebase';
import { generateUUID } from '@/utils/uuid';
import { UserContext } from '@/hooks/userContext';
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

const CreateToken = () => {
  const user = useContext(UserContext).user;
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof createTokenSchema>>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      title: '',
      tokenImg: undefined,
    },
  });

  const handleCreateToken = async (
    values: z.infer<typeof createTokenSchema>
  ) => {
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
