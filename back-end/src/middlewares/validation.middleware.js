export const validateSquema = (schema) => {
  return (req, res, next) => {
    try {
      if (!schema) return res.status(404).send({ error: 'schema is missing' })

      const result = schema.safeParse(req.body)

      if (!result.success) {
        const errors = result.error.errors
        const formatedErrors = errors.map(error => {
          if (error.message && error.path) return { name: error.path[0], message: error.message }

          return null
        })

        return res.status(400).send({ error: 'Invalid request', details: formatedErrors })
      }

      next()
    } catch (error) {
      console.error('Error in validateSquema::: ', error)
      res.status(500).send({ status: 500, error: 'Something went wrong: Error in the validation of values' })
    }
  }
}
