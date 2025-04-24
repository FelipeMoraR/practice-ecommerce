import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').min(4, 'Min length Username 4').max(10, 'Max length Username 10'),
  password: z.string().min(1, 'Password is required')
})

export type FormLoginValues = z.infer<typeof loginSchema>
