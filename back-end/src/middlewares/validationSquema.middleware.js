export const validateSquema = (schema) => {
  return (req, res, next) => {
    try {
      if (!schema) return res.status(404).send({ status: 400, message: 'Schema is missing' })
      if (!req.body) return res.status(400).send({ status: 400, message: 'Request body cannot be empty' })

      const result = schema.safeParse(req.body)

      if (!result.success) {
        const errors = result.error.errors
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
      res.status(500).send({ status: 500, error: 'Something went wrong: Error in the validation of values' })
    }
  }
}
