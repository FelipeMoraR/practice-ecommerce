export const regexPassword = /^[a-zA-Z0-9_@#$!¡.-]+$/ // NOTE !-. means a range of ASCII characters
export const regexUsername = /^[a-zA-Z0-9._]+$/ // NOTE + is to iterate in each element, ^ $ says took all the string
export const regexAtLeastOneNumber = /[0-9]/
export const regexAtLeastOneSpecialCharacter = /[_@#$!¡.-]/
export const regexAtleastOneLetter = /[a-zA-Z]/