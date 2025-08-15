import { z } from 'zod';
import { 
    regexPassword, 
    regexAtLeastOneNumber, 
    regexAtLeastOneSpecialCharacter, 
    regexAtleastOneLetter } from '../../utils/regex';

export const updateProfilePasswordSchema = z.object({
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


export type FormUpdateProfilePassword = z.infer<typeof updateProfilePasswordSchema>