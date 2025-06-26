import { HttpError } from '../utils/customErrors.js'

export const validateSquema = (schema, typeReqData) => {
  return (req, res, next) => {
    try {
      let dataToValidate = null
      // Explicitly select data based on typeReqData
      switch (typeReqData) {
        case 'query':
          dataToValidate = req.query
          break
        case 'params':
          dataToValidate = req.params
          break
        case 'body':
          dataToValidate = req.body
          break
        default:
          // This is a developer error - incorrect usage of the middleware
          throw new HttpError('Invalid typeReqData provided to validateSchema middleware.', 500)
      }

      if (!dataToValidate && typeReqData === 'query') dataToValidate = {}

      if (!schema) return res.status(404).send({ status: 400, message: 'Schema is missing' })
      if (!dataToValidate) return res.status(400).send({ status: 400, message: 'Request body cannot be empty' })

      const result = schema.safeParse(dataToValidate)

      if (!result.success) {
        const errors = result.error.errors
        console.log(errors)
        const formatedErrors = errors.reduce((acc, error) => {
          if (!error.message || !error.path) return acc
          const nameError = error.path[0]
          const messageError = error.message
          const objFinded = acc.find(el => el.name === nameError)

          if (objFinded) {
            objFinded.message = objFinded.message + ', ' + messageError
            return acc
          }

          acc.push({ name: nameError, message: messageError })
          return acc
        }, [])

        return res.status(400).send({ error: 'Invalid request', details: formatedErrors })
      }

      next()
    } catch (error) {
      console.error('validateSquema::: ', error)
      if (error instanceof HttpError) return res.status(error.statusCode).send({ status: error.statusCode, message: error.message })

      res.status(500).send({ status: 500, error: 'Something went wrong: Error in the validation of values' })
    }
  }
}
