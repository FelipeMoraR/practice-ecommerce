import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required').max(250, 'Max length email 250'),
  password: z.string().min(1, 'Password is required'),
  deviceId: z.number().optional()
})

export type FormLoginValues = z.infer<typeof loginSchema>
