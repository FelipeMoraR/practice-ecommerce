export class UserExistError extends Error {
  constructor (message = 'User already exist') {
    super(message) // NOTE this pass the msg to the base class Error
    this.name = 'UserExistsError' // NOTE refers to the name property of Error
    this.statusCode = 409 // NOTE Conflict
  }
}
