import { z } from 'zod'
import { regexUsername, regexPassword, regexAtLeastOneNumber, regexAtLeastOneSpecialCharacter, regexAtleastOneLetter } from '../utils/regex.js'

const blockedDomains = [
  'mailinator.com',
  'yopmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'maildrop.cc',
  'mailnesia.com',
  'getnada.com',
  'throwawaymail.com',
  'temp-mail.io'
]

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required').max(250, 'Max length email 250'),
  password: z.string().min(1, 'Password is required')
}).refine((data) => {
  const emailDomain = data.email.split('@')[1]?.toLowerCase()
  return emailDomain && !blockedDomains.includes(emailDomain)
}, {
  message: 'Email domain not allowed',
  path: ['email']
})

// TODO update this.
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
