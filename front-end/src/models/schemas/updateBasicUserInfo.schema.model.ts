import { z } from 'zod';
import { regexOnlyLetterAndSpaces } from '../../utils/regex';


export const updateBasicUserInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(45, 'Max length name 45').regex(regexOnlyLetterAndSpaces, 'Search just accepts letters'),
  lastName: z.string().min(1, 'Last name is required').max(45, 'Max length last name 45').regex(regexOnlyLetterAndSpaces, 'Search just accepts letters')
})

export type FormUpdateBasicUserInfoValues = z.infer<typeof updateBasicUserInfoSchema>