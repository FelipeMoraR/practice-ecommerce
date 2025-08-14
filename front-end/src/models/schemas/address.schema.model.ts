import { z } from 'zod';
import { regexOnlyLetterAndSpaces } from '../../utils/regex';

export const addressSquema = z.object({
    street: z.string().min(1, 'Street is required').max(100, 'Street is too long, its max length is 100').regex(regexOnlyLetterAndSpaces, 'Street only accept letters'),
    number: z.string().min(1, 'Number is required'),
    numDpto: z.string().min(0, 'NumDpto is required').optional(),
    postalCode: z.string().min(1, 'Postal code is required').regex(/^\d+$/, 'Postal code must contain only digits').length(7, 'Postal code mus have a length of 7'),
    idCommune: z.number().min(1, 'idCommune is required')
})

export type FormAddAddressValues = z.infer<typeof addressSquema>

export const updateAddressSquema = addressSquema.extend({
    idAddress: z.string().min(1, 'idAddress is required').length(36, 'idAddress must have 36 char')
});

export type FormUpdateAddressValues = z.infer<typeof updateAddressSquema>