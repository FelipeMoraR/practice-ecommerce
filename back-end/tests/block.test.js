import fetch from 'node-fetch'

const URL_SERVER = 'http://localhost:3000/api/v1/users/login'
const NUM_PETITIONS = 1000

async function doPetition () {
  try {
    const response = await fetch(URL_SERVER, {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@admin.com',
        password: 'mora@1234',
        deviceId: 1
      })
    })
    if (!response.ok) {
      console.error('Error in the petition: ', response.status, await response.text())
    }
  } catch (error) {
    console.error('Error to connect:', error.message)
  }
}

async function loadSimulator () {
  console.log(`Sending ${NUM_PETITIONS} to ${URL_SERVER}...`)
  const promesas = []
  for (let i = 0; i < NUM_PETITIONS; i++) {
    promesas.push(doPetition())
  }
  await Promise.all(promesas)
  console.log('All petitions sended')
}

loadSimulator()
