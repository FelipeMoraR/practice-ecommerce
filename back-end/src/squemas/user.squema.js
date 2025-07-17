import { z } from 'zod'
import {
  regexPassword,
  regexAtLeastOneNumber,
  regexAtLeastOneSpecialCharacter,
  regexAtleastOneLetter,
  regexOnlyLetter,
  regexOnlyNumbers,
  regexOnlyLetterAndSpaces,
  regexOrderQuery
} from '../utils/regex.js'

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
  password: z.string().min(1, 'Password is required'),
  deviceId: z.number().optional()
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required').max(250, 'Max length email 250'),
  password: z.string().min(1, 'Password is required').length(9, 'Password must have 9 characters'),
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
  })

export const sendForgotPasswordEmailSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required').max(250, 'Max length email 250'),
  deviceId: z.number().optional()
}).refine((data) => {
  const emailDomain = data.email.split('@')[1]?.toLowerCase()
  return emailDomain && !blockedDomains.includes(emailDomain)
}, {
  message: 'Email domain not allowed',
  path: ['email']
})

export const userIdSchema = z.object({
  userId: z.string().min(1, 'userId is required').length(36, 'userId must have 36 char')
})

export const addressIdSchema = z.object({
  idAddress: z.string().min(1, 'idAddress is required').length(36, 'idAddress must have 36 char')
})

export const forgotPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  secret: z.string().min(1, 'Secret is required'),
  newPassword: z.string().min(1, 'New password is required').length(9, 'New password must have 9 characters'),
  confirmNewPassword: z.string().min(1, 'Confirm new password is required').length(9, 'Confirm new password must have 9 characters')
})
  .superRefine((data, context) => {
    // ANCHOR newPassword validations
    if (!regexPassword.test(data.newPassword)) {
      context.addIssue({
        message: 'Special caracters of new password are invalid, special character allowed are _ - @ # $ ! ¡ .',
        path: ['newPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtLeastOneNumber.test(data.newPassword)) {
      context.addIssue({
        message: 'New password must contain at least one number',
        path: ['newPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtLeastOneSpecialCharacter.test(data.newPassword)) {
      context.addIssue({
        message: 'New password must contain at least one valid special character',
        path: ['newPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtleastOneLetter.test(data.newPassword)) {
      context.addIssue({
        message: 'New password must contain at least one letter',
        path: ['newPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR confirmNewPassword validation
    if (data.newPassword !== data.confirmNewPassword) {
      context.addIssue({
        message: 'New password and confirm new password must be equal',
        path: ['confirmNewPassword'],
        code: z.ZodIssueCode.custom
      })
    }
  })

export const updatePasswordSchema = z.object({
  oldPassword: z.string().length(9, 'oldPassword must have 9 characters'),
  newPassword: z.string().length(9, 'New password must have 9 characters'),
  confirmNewPassword: z.string().length(9, 'confirmNewPassword must have 9 characters')
})
  .superRefine((data, context) => {
    // ANCHOR oldPassword validations
    if (!regexPassword.test(data.oldPassword)) {
      context.addIssue({
        message: 'Special caracters of old password are invalid, special character allowed are _ - @ # $ ! ¡ .',
        path: ['oldPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtLeastOneNumber.test(data.oldPassword)) {
      context.addIssue({
        message: 'Old password must contain at least one number',
        path: ['oldPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtLeastOneSpecialCharacter.test(data.oldPassword)) {
      context.addIssue({
        message: 'Old password must contain at least one valid special character',
        path: ['oldPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtleastOneLetter.test(data.oldPassword)) {
      context.addIssue({
        message: 'Old password must contain at least one letter',
        path: ['oldPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR newPassword validations
    if (!regexPassword.test(data.newPassword)) {
      context.addIssue({
        message: 'Special caracters of new password are invalid, special character allowed are _ - @ # $ ! ¡ .',
        path: ['newPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtLeastOneNumber.test(data.newPassword)) {
      context.addIssue({
        message: 'New password must contain at least one number',
        path: ['newPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtLeastOneSpecialCharacter.test(data.newPassword)) {
      context.addIssue({
        message: 'New password must contain at least one valid special character',
        path: ['newPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    if (!regexAtleastOneLetter.test(data.newPassword)) {
      context.addIssue({
        message: 'New password must contain at least one letter',
        path: ['newPassword'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR confirmNewPassword validation
    if (data.newPassword !== data.confirmNewPassword) {
      context.addIssue({
        message: 'New password and confirm new password must be equal',
        path: ['confirmNewPassword'],
        code: z.ZodIssueCode.custom
      })
    }
  })

export const tokenSchema = z.object({
  token: z.string().min(1, 'Token is required')
})

export const addAddressUserSchema = z.object({
  street: z.string().min(1, 'Street is required').max(100, 'Street is too long, its max length is 100').regex(regexOnlyLetterAndSpaces, 'Street only accept letters'),
  number: z.number().min(1, 'Number is required'),
  numDpto: z.number().min(0, 'NumDpto is required').optional(),
  postalCode: z.string().min(1, 'Postal code is required').regex(/^\d+$/, 'Postal code must contain only digits').length(7, 'Postal code mus have a length of 7').transform(Number),
  idCommune: z.number().min(1, 'idCommune is required')
})

export const addAddressUserByAdminSchema = z.object({
  idUser: z.string().min(1, 'userId is required').length(36, 'userId must have 36 char'),
  street: z.string().min(1, 'Street is required').max(100, 'Street is too long, its max length is 100').regex(regexOnlyLetterAndSpaces, 'Street only accept letters'),
  number: z.number().min(1, 'Number is required'),
  numDpto: z.number().min(0, 'NumDpto is required'),
  postalCode: z.string().min(1, 'Postal code is required').regex(/^\d+$/, 'Postal code must contain only digits').length(7, 'Postal code mus have a length of 7').transform(Number),
  idCommune: z.number().min(1, 'idCommune is required')
})

export const updateAddressUserSchema = z.object({
  idAddress: z.string().min(1, 'idAddress is required').length(36, 'idAddress must have 36 char'),
  street: z.string().min(1, 'Street is required').max(100, 'Street is too long, its max length is 100').regex(regexOnlyLetterAndSpaces, 'Street only accept letters').optional(),
  number: z.number().min(1, 'Number is required').optional(),
  numDpto: z.number().min(0, 'NumDpto is required').optional(),
  postalCode: z.string().min(1, 'Postal code is required').regex(/^\d+$/, 'Postal code must contain only digits').length(7, 'Postal code mus have a length of 7').transform(Number).optional(),
  idCommune: z.number().min(1, 'idCommune is required').optional()
})

export const updateBasicUserInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(45, 'Max length name 45').regex(regexOnlyLetterAndSpaces, 'Search just accepts letters').optional(),
  lastName: z.string().min(1, 'Last name is required').max(45, 'Max length last name 45').regex(regexOnlyLetterAndSpaces, 'Search just accepts letters').optional()
})

export const updatePhoneUserSchema = z.object({
  phone: z.string().length(8, 'Phone must have 8 digits').regex(/^\d+$/, 'Phone number must contain only digits').transform(Number)
})

export const getClientsSchema = z.object({
  page: z.string().regex(regexOnlyNumbers, 'Page just accept numbers').optional(),
  size: z.string().regex(regexOnlyNumbers, 'Size just accept numbers').optional(),
  search: z.string().regex(regexOnlyLetterAndSpaces, 'Search just accepts letters').optional(),
  order: z.string().regex(regexOrderQuery, 'Order only accept this format asc|desc(field)').optional()
})

export const updateClientPersonalInfoSchema = z.object({
  id: z.string().min(1, 'id is required').length(36, 'id must have 36 char'),
  email: z.string().email('Invalid email address').min(1, 'Email is required').max(250, 'Max length email 250').optional(),
  password: z.string().length(9, 'Password must have 9 characters').optional(),
  name: z.string().min(1, 'Name is required').max(45, 'Max length name 45').optional(),
  lastName: z.string().min(1, 'Last name is required').max(45, 'Max length last name 45').optional(),
  phone: z.string().length(8, 'Phone must have 8 digits').regex(/^\d+$/, 'Phone number must contain only digits').transform(Number).optional()
})
  .superRefine((data, context) => {
    // ANCHOR - email valdiation
    const emailDomain = data.email?.split('@')[1]?.toLowerCase()

    if (emailDomain && blockedDomains.includes(emailDomain)) {
      context.addIssue({
        message: 'Email domain not allowed',
        path: ['email'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR - password valdiation
    if (data.password && !regexPassword.test(data.password)) {
      context.addIssue({
        message: 'Special caracters of password are invalid, special character allowed are _ - @ # $ ! ¡ .',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    if (data.password && !regexAtLeastOneNumber.test(data.password)) {
      context.addIssue({
        message: 'Must contain at least one number',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    if (data.password && !regexAtLeastOneSpecialCharacter.test(data.password)) {
      context.addIssue({
        message: 'Must contain at least one valid special character',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    if (data.password && !regexAtleastOneLetter.test(data.password)) {
      context.addIssue({
        message: 'Must contain at least one letter',
        path: ['password'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR - name validation
    if (data.name && !regexOnlyLetter.test(data.name)) {
      context.addIssue({
        message: 'Values not valid in name, use just letters',
        path: ['name'],
        code: z.ZodIssueCode.custom
      })
    }

    // ANCHOR - lastname validation
    if (data.lastName && !regexOnlyLetter.test(data.lastName)) {
      context.addIssue({
        message: 'Values not valid in last name, use just letters',
        path: ['lastName'],
        code: z.ZodIssueCode.custom
      })
    }
  })

export const updateClientAddressSchema = z.object({
  idUser: z.string().min(1, 'idUser is required').length(36, 'idUser must have 36 char'),
  idAddress: z.string().min(1, 'idAddress is required').length(36, 'idAddress must have 36 char'),
  street: z.string().min(1, 'Street is required').max(100, 'Street is too long, its max length is 100').regex(regexOnlyLetterAndSpaces, 'Street only accept letters').optional(),
  number: z.number().min(1, 'Number is required').optional(),
  numDpto: z.number().min(0, 'NumDpto is required').optional(),
  postalCode: z.string().min(1, 'Postal code is required').regex(/^\d+$/, 'Postal code must contain only digits').length(7, 'Postal code mus have a length of 7').transform(Number).optional(),
  idCommune: z.number().min(1, 'idCommune is required').optional()
})

export const deleteClientAddressSchema = z.object({
  idUser: z.string().min(1, 'idUser is required').length(36, 'idUser must have 36 char'),
  idAddress: z.string().min(1, 'idAddress is required').length(36, 'idAddress must have 36 char')
})

export const validateEmailSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required').max(250, 'Max length email 250')
})
