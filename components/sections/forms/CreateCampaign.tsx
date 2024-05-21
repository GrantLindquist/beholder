'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createCampaignSchema } from '@/types/FormSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateUUID } from '@/utils/uuid';
import { CampaignType } from '@/types/GameBoardTypes';
import { arrayUnion, doc, setDoc, updateDoc } from '@firebase/firestore';
import db from '@/app/firebase';

const CreateCampaign = () => {
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof createCampaignSchema>>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      title: undefined,
      description: undefined,
    },
  });

  const handleCreateCampaign = async (
    values: z.infer<typeof createCampaignSchema>
  ) => {
    if (user) {
      const campaignId = generateUUID();

      const newCampaign: CampaignType = {
        id: campaignId,
        title: values.title,
        description: values.description,
        boardIds: [],
        activePlayers: [],
        playerIds: [user.uid],
        dmId: user.uid,
      };

      const userDocRef = doc(db, 'users', user.uid);
      const campaignDocRef = doc(db, 'campaigns', newCampaign.id);
      await setDoc(campaignDocRef, newCampaign);
      await updateDoc(userDocRef, {
        campaigns: arrayUnion(newCampaign.id),
      });

      router.push(`campaigns/${campaignId}`);
    }
  };

  // TODO: Go through each form and rename placeholders
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateCampaign)}
        className="space-y-4"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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
export default CreateCampaign;
