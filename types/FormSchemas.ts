import { z } from 'zod';

export const createGameBoardSchema = z
  .object({
    title: z.string().max(50, {
      message: `Woah, you sure typed a lot. Let's be a bit more concise, yeah?`,
    }),
    backgroundImg: z.string().optional(),
    width: z
      .number()
      .gte(1, { message: 'Too small.' })
      .lte(40, { message: 'Damn! Too big!' }),
    height: z
      .number()
      .gte(1, { message: 'Too small.' })
      .lte(40, { message: 'Damn! Too big!' }),
  })
  .required();

export const createTokenSchema = z
  .object({
    title: z.string().max(50, {
      message: `Woah, you sure typed a lot. Let's be a bit more concise, yeah?`,
    }),
    tokenImg: z.string().optional(),
  })
  .required();
