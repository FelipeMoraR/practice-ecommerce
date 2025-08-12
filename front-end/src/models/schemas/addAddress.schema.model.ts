import { z } from 'zod';
import { regexOnlyLetterAndSpaces } from '../../utils/regex';

export const addAddressSquema = z.object({
    street: z.string().min(1, 'Street is required').max(100, 'Street is too long, its max length is 100').regex(regexOnlyLetterAndSpaces, 'Street only accept letters'),
    number: z.number().min(1, 'Number is required'),
    numDpto: z.number().min(0, 'NumDpto is required').optional(),
    postalCode: z.string().min(1, 'Postal code is required').regex(/^\d+$/, 'Postal code must contain only digits').length(7, 'Postal code mus have a length of 7'),
    idCommune: z.number().min(1, 'idCommune is required')
})

export type FormAddAddressValues = z.infer<typeof addAddressSquema>
