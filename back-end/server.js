import app from './app.js'
import { PORT } from './src/config/config.js'

app.get('/', (req, res) => {
  const currentTimeUTC = new Date().toISOString()
  console.log(req.headers['user-agent'])
  res.json({ currentTimeUTC })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
