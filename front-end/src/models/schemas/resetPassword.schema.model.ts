import { z } from 'zod';
import { 
    regexPassword, 
    regexAtLeastOneNumber, 
    regexAtLeastOneSpecialCharacter, 
    regexAtleastOneLetter } from '../../utils/regex';

export const resetPasswordSquema = z.object({
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

export type FormResetPasswordValues = z.infer<typeof resetPasswordSquema>
