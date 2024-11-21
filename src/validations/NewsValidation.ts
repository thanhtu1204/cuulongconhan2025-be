import { z } from 'zod';

export const NewsSchema = z.object({
  id: z.coerce.number()
});
