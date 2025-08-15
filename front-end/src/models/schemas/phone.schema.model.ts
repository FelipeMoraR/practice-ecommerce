import { z } from 'zod';

export const updatePhoneSchema = z.object({
  phone: z.string().length(8, 'Phone must have 8 digits').regex(/^\d+$/, 'Phone number must contain only digits')
})

export type FormUpdatePhone = z.infer<typeof updatePhoneSchema>
