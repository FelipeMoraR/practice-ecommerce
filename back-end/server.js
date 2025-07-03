import app from './app.js'
import { PORT } from './src/config/config.js'

// TODO Integrate the logger in all the controllers
app.get('/', (_, res) => {
  const currentTimeUTC = new Date().toISOString()
  res.json({ currentTimeUTC })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
