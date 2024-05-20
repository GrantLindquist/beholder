import { z } from 'zod';

export const createGameBoardSchema = z.object({
  title: z.string().max(50, {
    message: `Woah, you sure typed a lot. Let's be a bit more concise, yeah?`,
  }),
  backgroundImg: z.string().nullish(),
  width: z.coerce
    .number()
    .gte(1, { message: 'Too small.' })
    .lte(40, { message: 'Damn! Too big!' }),
  height: z.coerce
    .number()
    .gte(1, { message: 'Too small.' })
    .lte(40, { message: 'Damn! Too big!' }),
});

export const createTokenSchema = z.object({
  title: z.string().max(50, {
    message: `Woah, you sure typed a lot. Let's be a bit more concise, yeah?`,
  }),
  tokenImg: z.string().nullish(),
  isMonster: z.boolean(),
});
