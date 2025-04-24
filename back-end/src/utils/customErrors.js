export class UserExistError extends Error {
  constructor (message = 'User already exist') {
    super(message) // NOTE this pass the msg to the base class Error
    this.name = 'UserExistsError' // NOTE refers to the name property of Error
    this.statusCode = 409 // NOTE Conflict
  }
}

export class LoginUserError extends Error {
  constructor (message = 'Error in login user', statusCode = 409) {
    super(message)
    this.name = 'LoginUserError'
    this.statusCode = statusCode
  }
}

export class HttpError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}
