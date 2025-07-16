/* eslint-disable no-undef */
import { server } from '../../app.js'
import { getAllDataOfTable, cleaningTable, api, agent } from '../helper.js'
import TokenWhiteList from '../../src/models/tokenWhiteList.model.js'
import TokenBlackList from '../../src/models/tokenBlackList.model.js'
import User from '../../src/models/user.model.js'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../src/config/config.js'

const salty = parseInt(SALT_ROUNDS, 10) // 10 because we wanted as a decimal

// NOTE Session logic (confirmEmailVerificationController, sendEmailVerificationController)
// NOTE execute separate to not made bugs
describe('Session logic', () => {
  const allPromises = [cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList), cleaningTable(User)]

  afterAll(async () => {
    await Promise.all(allPromises)
    server.close()
  })

  beforeAll(async () => await Promise.all(allPromises))

  xdescribe('Integration Register testing', () => {
    afterAll(async () => await cleaningTable(User))

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
        throw error
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
        throw error
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
        throw error
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

    test('Testing user register: Duplicate user', async () => {
      try {
        await api.post('/api/v1/users/register').send(correctParams).expect(409)
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })

  xdescribe('Integration Login testing', () => {
    const id = crypto.randomUUID()
    beforeAll(async () => {
      const hashedPassword = await bcrypt.hash('@1234567a', salty)
      await User.create({ id, email: 'admin@admin.com', password: hashedPassword, name: 'Admin', lastName: 'Admin', fk_id_type_user: 2 })
    })

    afterAll(async () => { await Promise.all([cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList), cleaningTable(User)]) })

    const correctParams = {
      email: 'admin@admin.com',
      password: '@1234567a',
      deviceId: 1
    }

    test('Testing login: Sending an empty object', async () => {
      try {
        await api.post('/api/v1/users/login').send({}).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Sending nothing', async () => {
      try {
        await api.post('/api/v1/users/login').send(undefined).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Not sending the email paramether', async () => {
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

    test('Testing login: Sending an empty email', async () => {
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

    test('Testing login: Not sending the password paramether', async () => {
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

    test('Testing login: Sending an empty password', async () => {
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

    test('Testing login: Not sending the device paramether', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '@1234567a'
        }
        await api.post('/api/v1/users/login').send(badParams).expect(403)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Sending an empty device', async () => {
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

    test('Testing login: Bad format email', async () => {
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

    test('Testing login: Email with an invalid special character', async () => {
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

    test('Testing login: Non exist email', async () => {
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

    test('Testing login: Correct email but incorrect password', async () => {
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

    test('Testing login: Correct email but invalid password', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '@1()234a5',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Correct email but short password', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '1@a4',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Correct email but long password', async () => {
      try {
        const badParams = {
          email: 'admin@admin.com',
          password: '1@a42131a42131a42131a42131',
          deviceId: 1
        }
        await api.post('/api/v1/users/login').send(badParams).expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Correct params but no verified', async () => {
      try {
        await api.post('/api/v1/users/login').send(correctParams).expect(403)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Correct params but verified', async () => {
      try {
        await User.update({ isVerified: true }, { where: { id } })
        await api.post('/api/v1/users/login').send(correctParams).expect(200)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Login twice with the same device and user verified', async () => {
      try {
        await Promise.all([cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList)])

        // NOTE First login
        await api.post('/api/v1/users/login').send(correctParams).expect(200)

        // NOTE second login
        await api.post('/api/v1/users/login').send(correctParams).expect(200)

        const { count: countWhiteList, rows: rowsWhiteList } = await getAllDataOfTable(TokenWhiteList)
        expect(rowsWhiteList).toBeTruthy()
        expect(countWhiteList).toEqual(1)
        const { count: countBlackList, rows: rowsBlackList } = await getAllDataOfTable(TokenBlackList)
        expect(rowsBlackList).toBeTruthy()
        expect(countBlackList).toEqual(1)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Login twice with two different devices and the same user verified', async () => {
      try {
        await Promise.all([cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList)])
        // NOTE First login
        await api.post('/api/v1/users/login').send(correctParams).expect(200)
        const newParams = {
          email: 'admin@admin.com',
          password: '@1234567a',
          deviceId: 2
        }
        await api.post('/api/v1/users/login').send(newParams).expect(200)
        const { count: countWhiteList, rows: rowsWhiteList } = await getAllDataOfTable(TokenWhiteList)
        expect(rowsWhiteList).toBeTruthy()
        expect(countWhiteList).toEqual(2)
        const { count: countBlackList, rows: rowsBlackList } = await getAllDataOfTable(TokenBlackList)
        expect(rowsBlackList).toBeTruthy()
        expect(countBlackList).toEqual(0)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Correct params but device is in cookies', async () => {
      try {
        const newParams = {
          email: 'admin@admin.com',
          password: '@1234567a'
        }

        // NOTE login with cookies
        const result = await agent.post('/api/v1/users/login').set('Cookie', 'id_device=1').send(newParams)
        expect(result.statusCode).toBe(200)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing login: Correct params but device is in cookies and the device is duplicated', async () => {
      try {
        const newParams = {
          email: 'admin@admin.com',
          password: '@1234567a'
        }

        await Promise.all([cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList)])

        // NOTE First login
        await api.post('/api/v1/users/login').send(correctParams).expect(200)

        // NOTE login with cookies
        await agent.post('/api/v1/users/login').set('Cookie', 'id_device=1').send(newParams).expect(200)

        const { count: countWhiteList, rows: rowsWhiteList } = await getAllDataOfTable(TokenWhiteList)
        expect(rowsWhiteList).toBeTruthy()
        expect(countWhiteList).toEqual(1)
        const { count: countBlackList, rows: rowsBlackList } = await getAllDataOfTable(TokenBlackList)
        expect(rowsBlackList).toBeTruthy()
        expect(countBlackList).toEqual(1)
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })

  xdescribe('Integration Logout Testing', () => {
    const id = crypto.randomUUID()
    let refreshTokenFromSession
    beforeAll(async () => {
      const hashedPassword = await bcrypt.hash('@1234567a', salty)
      await User.create({ id, email: 'admin2@admin.com', password: hashedPassword, name: 'Admin', isVerified: true, lastName: 'Admin', fk_id_type_user: 2 })

      // NOTE Login user
      const userLoged = await api.post('/api/v1/users/login').send({
        email: 'admin2@admin.com',
        password: '@1234567a',
        deviceId: 1
      })

      if (userLoged.statusCode !== 200) throw new Error(`Failed to log in user in beforeAll. Status: ${userLoged.statusCode}, Body: ${JSON.stringify(userLoged.body)}`)

      const setCookieHeaders = userLoged.header['set-cookie']
      if (setCookieHeaders && setCookieHeaders.length > 0) {
        const cookie = setCookieHeaders.find(cookie => cookie.startsWith('refresh_token='))
        if (!cookie) throw new Error('Cookie not setted')
        const parsedCookie = cookie.split(';')
        refreshTokenFromSession = parsedCookie[0] || null
      }
    })

    afterAll(async () => { await Promise.all([cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList), cleaningTable(User)]) })

    test('Testing Logout: With out refresh_token cookie', async () => {
      try {
        const response = await agent.post('/api/v1/users/logout').set('Cookie', null).send({})
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBe('No cookie provided')
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing Logout: With a bad refresh_token cookie', async () => {
      try {
        const response = await agent.post('/api/v1/users/logout').set('Cookie', 'refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMzA4NzRjLTY4Y2QtNGY2Zi1hNDk4LTg1NjNhMGQ3NGI0YSIsImp0aSI6Ijk5NjMzNWRkLWM4NTMtNDI0ZS04ZTA1LTA3NzgxNGJkYzY5YiIsImlhdCI6MTc1MjYyNjk5NCwiZXhwIjoxNzUzMjMxNzk0fQ.wTpmrz7p8hXt9aB1A7GP3sSRhQLmYizHd9Qnd8o90ZU').send({})

        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBe('User not exist')
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing Logout: With good params', async () => {
      try {
        const response = await agent.post('/api/v1/users/logout').set('Cookie', refreshTokenFromSession).send({})
        const { count, rows } = await getAllDataOfTable(TokenBlackList)
        expect(rows).toBeTruthy()
        expect(count).toBe(1)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe('Logout successful')
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })
})
