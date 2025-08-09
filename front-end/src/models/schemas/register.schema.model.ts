import { z } from 'zod';
import {
    regexAtLeastOneNumber,
    regexAtLeastOneSpecialCharacter,
    regexAtleastOneLetter,
    regexOnlyLetter,
    regexPassword,
} from '../../utils/regex';

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
];

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required').max(250, 'Max length email 250'),
  password: z.string().min(1, 'Password is required').length(9, 'Password must have 9 characters'),
  confirmPassword: z.string().min(1, 'Password is required').length(9, 'Password must have 9 characters'),
  name: z.string().min(1, 'Name is required').max(45, 'Max length name 45'),
  lastName: z.string().min(1, 'Last name is required').max(45, 'Max length last name 45')
})
  .superRefine((data, context) => {
    // ANCHOR - email valdiation
    const emailDomain = data.email.split('@')[1]?.toLowerCase()

    if (!(emailDomain && !blockedDomains.includes(emailDomain))) {
      context.addIssue({
        message: 'Email domain not allowed',
        path: ['email'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR - password valdiation
    if (!regexPassword.test(data.password)) {
      context.addIssue({
        message: 'Special caracters of password are invalid, special character allowed are _ - @ # $ ! ¡ .',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtLeastOneNumber.test(data.password)) {
      context.addIssue({
        message: 'Must contain at least one number',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtLeastOneSpecialCharacter.test(data.password)) {
      context.addIssue({
        message: 'Must contain at least one valid special character',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtleastOneLetter.test(data.password)) {
      context.addIssue({
        message: 'Must contain at least one letter',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR - name validation
    if (!regexOnlyLetter.test(data.name)) {
      context.addIssue({
        message: 'Values not valid in name, use just letters',
        path: ['name'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR - lastname validation
    if (!regexOnlyLetter.test(data.lastName)) {
      context.addIssue({
        message: 'Values not valid in last name, use just letters',
        path: ['lastName'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR confirmPassword validation
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        message: 'Password and confirm password must be equals',
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom
      })
    }
  })