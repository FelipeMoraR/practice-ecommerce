import { z } from 'zod'
import { regexUsername, regexPassword, regexAtLeastOneNumber, regexAtLeastOneSpecialCharacter, regexAtleastOneLetter } from '../utils/regex.js'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').min(4, 'Min length Username 4').max(10, 'Max length Username 10'),
  password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
  username: z.string().min(1, 'Username is required').min(4, 'Min length Username 4').max(10, 'Max length Username 10'),
  password: z.string().min(1, 'Password is required').length(9, 'Password must have 9 characters')
})
  .superRefine((data, context) => {
    // ANCHOR - username valdiation

    if (!regexUsername.test(data.username)) {
      context.addIssue({
        message: 'Username Error: Special character are not allowed (except . and _), use letters, numbers',
        path: ['username'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR - password valdiation

    if (!regexPassword.test(data.password)) {
      context.addIssue({
        message: 'Password Error: Values of password are invalid, special character allowed _ - @ # $ ! ¡ .',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtLeastOneNumber.test(data.password)) {
      context.addIssue({
        message: 'Password Error: Password must contain at least one number',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtLeastOneSpecialCharacter.test(data.password)) {
      context.addIssue({
        message: 'Password Error: Password must contain at least one special character',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtleastOneLetter.test(data.password)) {
      context.addIssue({
        message: 'Password Error: Password must contain at least one letter',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }
  })
