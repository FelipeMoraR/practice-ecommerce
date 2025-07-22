import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Username is required').min(4, 'Min length Username 4').max(250, 'Max length Username 10'),
  password: z.string().min(1, 'Password is required'),
  deviceId: z.number()
})

export type FormLoginValues = z.infer<typeof loginSchema>
