/* eslint-disable no-undef */
import { server } from '../../app.js'
import { cleaningTable, api } from '../helper.js'
import TokenWhiteList from '../../src/models/tokenWhiteList.model.js'
import TokenBlackList from '../../src/models/tokenBlackList.model.js'
import User from '../../src/models/user.model.js'

// NOTE Session logic (loginUserController, registerUserController, logoutUserController, confirmEmailVerificationController, sendEmailVerificationController)
describe('Session logic', () => {
  const allPromises = [cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList), cleaningTable(User)]

  afterAll(async () => {
    await Promise.all(allPromises)
    server.close()
  })

  beforeAll(async () => await Promise.all(allPromises))

  describe('Register testing', () => {
    const correctParams = {
      email: 'admin@admin.com',
      password: '@1234567a',
      name: 'Admin',
      lastName: 'Admin'
    }

    test('Testing user register sending an empty object', async () => {
      try {
        const badParams = {
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register sending an nothing', async () => {
      try {
        await api.post('/api/v1/users/register').send(undefined).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register without email', async () => {
      try {
        const badParams = {
          password: '@1234567a',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with an empty email', async () => {
      try {
        const badParams = {
          email: '',
          password: '@1234567a',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register without password', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with an empty password', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register without name', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '@1234567a',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with an empty name', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '@1234567a',
          name: '',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register without lastname', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '@1234567a',
          name: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with an empty lastname', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '@1234567a',
          name: 'Admin',
          lastName: ''
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with an email without @', async () => {
      try {
        const badParams = {
          email: 'admiadmin.com',
          password: '@1234567a',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with an email with a bad format', async () => {
      try {
        const badParams = {
          email: 'admia.com@dmin',
          password: '@1234567a',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with an email with specials characters', async () => {
      try {
        const badParams = {
          email: '!"#$%&/((?¡)=@gmail.com',
          password: '@1234567a',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
      }
    })

    test('Testing user register with a banned email domain', async () => {
      try {
        const badParams = {
          email: 'admin@yopmail.com',
          password: '@1234567a',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
      }
    })

    test('Testing user register with a short password', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: '1a3@',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with an extra long password', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: '123a45678@a901029',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with only numbers password', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: '123456789',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
      }
    })

    test('Testing user register with a only letters password', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: 'asdfghjkl',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with a only special characters password', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: '@!"#$%&/(',
          name: 'Admin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with a name with numbers', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: '@1234567a',
          name: 'Admi12n',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with a name with special characters', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: '@1234567a',
          name: 'Admi@!"#$!"n',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with a long name', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: '@1234567a',
          name: 'AdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdmin',
          lastName: 'Admin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with a lastname with numbers', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: '@1234567a',
          name: 'Admin',
          lastName: 'Admi1n'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with a lastname with special characters', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: '@1234567a',
          name: 'Admin',
          lastName: 'Ad#mi@n'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with a long lastname', async () => {
      try {
        const badParams = {
          email: 'admin@gmail.com',
          password: '@1234567a',
          name: 'Admin',
          lastName: 'AdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdminAdmin'
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register with correct parameters', async () => {
      try {
        await api.post('/api/v1/users/register').send(correctParams).expect(200)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register that already exist', async () => {
      try {
        await api.post('/api/v1/users/register').send(correctParams).expect(409)
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })
})
