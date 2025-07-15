/* eslint-disable no-undef */
import { server } from '../../app.js'
import { getAllDataOfTable, cleaningTable, api } from '../helper.js'
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

    test('Testing user register: sending an empty object', async () => {
      try {
        const badParams = {
        }
        await api.post('/api/v1/users/register').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register: Sending nothing', async () => {
      try {
        await api.post('/api/v1/users/register').send(undefined).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register: Without email', async () => {
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

    test('Testing user register: Empty email', async () => {
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

    test('Testing user register: Without password', async () => {
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

    test('Testing user register: With an empty password', async () => {
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

    test('Testing user register: Without name', async () => {
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

    test('Testing user register: Empty name', async () => {
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

    test('Testing user register: Without lastname', async () => {
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

    test('Testing user register: Empty lastname', async () => {
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

    test('Testing user register: Email without @', async () => {
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

    test('Testing user register: Email with a bad format', async () => {
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

    test('Testing user register: Email with specials characters', async () => {
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

    test('Testing user register: Banned email domain', async () => {
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

    test('Testing user register: Short password', async () => {
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

    test('Testing user register: Extra long password', async () => {
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

    test('Testing user register: Only numbers password', async () => {
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

    test('Testing user register: Only letters password', async () => {
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

    test('Testing user register: Only special characters password', async () => {
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

    test('Testing user register: Name with numbers', async () => {
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

    test('Testing user register: Name with special characters', async () => {
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

    test('Testing user register: Long name', async () => {
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

    test('Testing user register: Lastname with numbers', async () => {
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

    test('Testing user register: Lastname with special characters', async () => {
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

    test('Testing user register: Long lastname', async () => {
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

    test('Testing user register: Corrects parameters', async () => {
      try {
        await api.post('/api/v1/users/register').send(correctParams).expect(200)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing user register: A user that already exist in db', async () => {
      try {
        await cleaningTable(User)
        await api.post('/api/v1/users/register').send(correctParams).expect(200)
        await api.post('/api/v1/users/register').send(correctParams).expect(409)
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })

  xdescribe('Login and verify email testing', () => {
    const correctParams = {
      email: 'admin@admin.com',
      password: '@1234567a',
      deviceId: 1
    }

    test('Testing login with an empty object', async () => {
      try {
        await api.post('/api/v1/users/login').send({}).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login with sending nothing', async () => {
      try {
        await api.post('/api/v1/users/login').send(undefined).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login not sending the email paramether', async () => {
      try {
        const badParams = {
          password: '@1234567a',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login sending an empty email', async () => {
      try {
        const badParams = {
          email: '',
          password: '@1234567a',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login not sending the email paramether', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login sending an empty password', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login not sending the device paramether', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '@1234567a'
        }
        await api.post('/api/v1/users/login').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login sending an empty device', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '@1234567a',
          deviceId: ''
        }
        await api.post('/api/v1/users/login').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login with a bad format email', async () => {
      try {
        const badParams = {
          email: 'ad.comm@in@admin.com',
          password: '@1234567a',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login with an email with an invalid special character', async () => {
      try {
        const badParams = {
          email: 'adm(in@admin.com',
          password: '@1234567a',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login with a non exist email', async () => {
      try {
        const badParams = {
          email: 'notExistEmail@gmail.com',
          password: '@1234567a',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login with a correct email but a bad password', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '@1234a567',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login with correct params', async () => {
      try {
        await api.post('/api/v1/users/login').send(correctParams).expect(200)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login with correct params with the same device', async () => {
      try {
        await api.post('/api/v1/users/login').send(correctParams).expect(200)
        const { countWhiteList, rowsWhiteList } = await getAllDataOfTable(TokenWhiteList)
        console.log('white list', countWhiteList, rowsWhiteList)
        expect(rowsWhiteList).toBeTruthy()
        expect(countWhiteList).toEqual(1)
        const { countBlackList, rowsBlackList } = await getAllDataOfTable(TokenBlackList)
        console.log('black list', countBlackList, rowsBlackList)
        expect(rowsBlackList).toBeTruthy()
        expect(countBlackList).toEqual(1)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login with correct params with other device', async () => {
      try {
        const newParams = {
          email: 'admin@admin.com',
          password: '@1234567a',
          deviceId: 2
        }
        await api.post('/api/v1/users/login').send(newParams).expect(200)
        const { countWhiteList, rowsWhiteList } = await getAllDataOfTable(TokenWhiteList)
        expect(rowsWhiteList).toBeTruthy()
        expect(countWhiteList).toEqual(2)
        const { countBlackList, rowsBlackList } = await getAllDataOfTable(TokenBlackList)
        expect(rowsBlackList).toBeTruthy()
        expect(countBlackList).toEqual(1)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    // TODO this
    test('Testing login  with correct params but device is in cookies', async () => {
      try {
        const newParams = {
          email: 'admin@admin.com',
          password: '@1234567a'
        }

        await api.post('/api/v1/users/login').set('Cookie', 'deviceId=2').send(newParams).expect(200)
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })
})
