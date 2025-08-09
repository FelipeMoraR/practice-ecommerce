import { z } from 'zod';

export const forgotPasswordSquema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required').max(250, 'Max length email 250'),
  deviceId: z.string().min(1, 'Device id is required').max(100, 'Max length email 100')
})

export type FormForgotPasswordValues = z.infer<typeof forgotPasswordSquema>
