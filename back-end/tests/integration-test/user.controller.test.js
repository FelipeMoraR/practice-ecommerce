/* eslint-disable no-undef */
import { server } from '../../app.js'
import { getAllDataOfTable, cleaningTable, api, agent } from '../helper.js'
import TokenWhiteList from '../../src/models/tokenWhiteList.model.js'
import TokenBlackList from '../../src/models/tokenBlackList.model.js'
import User from '../../src/models/user.model.js'
import UserAddress from '../../src/models/userAddress.module.js'
import Address from '../../src/models/address.model.js'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../src/config/config.js'

const salty = parseInt(SALT_ROUNDS, 10) // 10 because we wanted as a decimal

// NOTE run separately to avoid bugs
xdescribe('Session logic', () => {
  const allPromises = [cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList), cleaningTable(User)]

  afterAll(async () => {
    await Promise.all(allPromises)
    server.close()
  })

  beforeAll(async () => await Promise.all(allPromises))

  xdescribe('Integration testing: Register', () => {
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

  xdescribe('Integration testing: Login', () => {
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

  xdescribe('Integration testing: Logout', () => {
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

  xdescribe('Integration testing: Re-send email verification', () => {
    const id = crypto.randomUUID()
    beforeAll(async () => {
      const hashedPassword = await bcrypt.hash('@1234567a', salty)
      await User.create({ id, email: 'admin2@admin.com', password: hashedPassword, name: 'Admin', lastName: 'Admin', lastVerificationEmailSentAt: new Date('1995-12-17T03:24:00'), fk_id_type_user: 2 })
    })

    afterAll(async () => { await Promise.all([cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList), cleaningTable(User)]) })

    test('Testing re-send email verification: Sending nothing', async () => {
      try {
        await api.post('/api/v1/users/resend-email-verification').send(null).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing re-send email verification: Sending only an object', async () => {
      try {
        await api.post('/api/v1/users/resend-email-verification').send({}).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing re-send email verification: Sending an empty email', async () => {
      try {
        const body = {
          email: ''
        }
        await api.post('/api/v1/users/resend-email-verification').send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing re-send email verification: Sending an invalid email', async () => {
      try {
        const body = {
          email: 'das/()@gmail.com'
        }
        await api.post('/api/v1/users/resend-email-verification').send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing re-send email verification: Sending an bad format email', async () => {
      try {
        const body = {
          email: 'd@gmailas@gmaildas.com'
        }
        await api.post('/api/v1/users/resend-email-verification').send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing re-send email verification: Sending a non exist email', async () => {
      try {
        const body = {
          email: 'randomEmail@gmail.com'
        }
        await api.post('/api/v1/users/resend-email-verification').send(body).expect(404)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing re-send email verification: Sending a email with a good email', async () => {
      try {
        const body = {
          email: 'admin2@admin.com'
        }
        await api.post('/api/v1/users/resend-email-verification').send(body).expect(200)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing re-send email verification: Sending a email with a user that already was verified', async () => {
      try {
        const body = {
          email: 'admin2@admin.com'
        }
        await User.update({ isVerified: true }, { where: { id } })
        await api.post('/api/v1/users/resend-email-verification').send(body).expect(204)
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })
})

xdescribe('Forgot password logic', () => {
  const id = crypto.randomUUID()
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('@1234567a', salty)
    await User.create({ id, email: 'admin2@admin.com', password: hashedPassword, name: 'Admin', lastName: 'Admin', lastVerificationEmailSentAt: new Date('1995-12-17T03:24:00'), fk_id_type_user: 2 })
  })

  afterAll(async () => { await Promise.all([cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList), cleaningTable(User)]) })

  test('Testing send email forgot password: Sending nothing in req', async () => {
    try {
      await api.post('/api/v1/users/send-email-forgot-password').send(null).expect(400)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  test('Testing send email forgot password: Sending an empty object', async () => {
    try {
      await api.post('/api/v1/users/send-email-forgot-password').send({}).expect(400)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  test('Testing send email forgot password: Sending an empty email', async () => {
    try {
      const body = {
        email: ''
      }
      await api.post('/api/v1/users/send-email-forgot-password').send(body).expect(400)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  test('Testing send email forgot password: Sending a bad email', async () => {
    try {
      const body = {
        email: 'das/()@gmail.com'
      }
      await api.post('/api/v1/users/send-email-forgot-password').send(body).expect(400)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  test('Testing send email forgot password: Sending an email bad formated', async () => {
    try {
      const body = {
        email: 'd@gmailas@gmaildas.com'
      }
      await api.post('/api/v1/users/send-email-forgot-password').send(body).expect(400)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  test('Testing send email forgot password: Send an unregistered email', async () => {
    try {
      const body = {
        email: 'randomEmail@gmail.com',
        deviceId: 1
      }
      await api.post('/api/v1/users/send-email-forgot-password').send(body).expect(404)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  test('Testing send email forgot password: Sending a correct email but not verified', async () => {
    try {
      const body = {
        email: 'admin2@admin.com',
        deviceId: 1
      }
      await api.post('/api/v1/users/send-email-forgot-password').send(body).expect(200)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  test('Testing send email forgot password: Sending a two emails at row to validate email', async () => {
    try {
      // NOTE Reseting user
      await User.update({ lastVerificationEmailSentAt: new Date('1995-12-17T03:24:00') }, { where: { id } })
      const body = {
        email: 'admin2@admin.com',
        deviceId: 1
      }
      await api.post('/api/v1/users/send-email-forgot-password').send(body).expect(200)
      await api.post('/api/v1/users/send-email-forgot-password').send(body).expect(403)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  test('Testing send email forgot password: Sending a correct email but verified', async () => {
    try {
      const body = {
        email: 'admin2@admin.com',
        deviceId: 1
      }
      await User.update({ isVerified: true }, { where: { id } })
      await api.post('/api/v1/users/send-email-forgot-password').send(body).expect(200)
      const { count, rows } = await getAllDataOfTable(TokenWhiteList)
      expect(rows).toBeTruthy()
      expect(count).toBe(1)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  test('Testing send email forgot password: Sending a correct email, verified and we already send an email', async () => {
    try {
      await cleaningTable(TokenWhiteList)

      const body = {
        email: 'admin2@admin.com',
        deviceId: 1
      }
      await User.update({ lastForgotPasswordSentAt: new Date('1995-12-17T03:24:00'), isVerified: true }, { where: { id } })
      await api.post('/api/v1/users/send-email-forgot-password').send(body).expect(200)
      await api.post('/api/v1/users/send-email-forgot-password').send(body).expect(403)
      const { count, rows } = await getAllDataOfTable(TokenWhiteList)
      expect(rows).toBeTruthy()
      expect(count).toBe(1)
    } catch (error) {
      console.log(error)
      throw error
    }
  })
})

describe('User administration', () => {
  const id = crypto.randomUUID()
  let cookies
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('@1234567a', salty)
    await User.create({ id, email: 'admin2@admin.com', password: hashedPassword, isVerified: true, name: 'Admin', lastName: 'Admin', fk_id_type_user: 2 })
    const body = {
      email: 'admin2@admin.com',
      password: '@1234567a',
      deviceId: 2
    }
    const response = await api.post('/api/v1/users/login').send(body)
    if (response.statusCode !== 200) throw new Error('User couldnt login')

    cookies = response.header['set-cookie']
    if (cookies.length < 1) throw new Error('No cookies setted')
  })

  afterAll(async () => { await Promise.all([cleaningTable(TokenWhiteList), cleaningTable(TokenBlackList), cleaningTable(User)]) })

  xdescribe('View user info testing', () => {
    test('Testing view user: Not sending cookies', async () => {
      try {
        await api.get('/api/v1/users/get-user').expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing view user: Sending olds cookies', async () => {
      try {
        const oldCookies = [
          'id_device=2; Max-Age=31536000; Path=/; Expires=Thu, 16 Jul 2026 20:08:22 GMT; HttpOnly; SameSite=Strict',
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMDhlM2IyLTUyZDAtNGNjMy04NWNjLTU1ZDc5NTFkOWZmOSIsInVzZXJGdWxsTmFtZSI6IkFkbWluIEFkbWluIiwiaWF0IjoxNzUyNjk2NTAyLCJleHAiOjE3NTI2OTcxMDJ9.z3F87LwXpj-N-UPMQjl8gXRj37bFSe6F4nvuu3OQWo8; Max-Age=600; Path=/; Expires=Wed, 16 Jul 2025 20:18:22 GMT; HttpOnly; SameSite=Strict',
          'refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMDhlM2IyLTUyZDAtNGNjMy04NWNjLTU1ZDc5NTFkOWZmOSIsImp0aSI6IjJiZWM3MDBkLTZjNjEtNGNmNi05NzgxLTdlN2U3NTY3NDgxZiIsImlhdCI6MTc1MjY5NjUwMiwiZXhwIjoxNzUzMzAxMzAyfQ.7ZbRpVsCinjBvso8IymkxOffHdJR9URDRMqLw9LqLxk; Max-Age=604800; Path=/; Expires=Wed, 23 Jul 2025 20:08:22 GMT; HttpOnly; SameSite=Strict'
        ]
        await api.get('/api/v1/users/get-user').set('Cookie', oldCookies).expect(498)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing view user: Sending an invalid access_token', async () => {
      try {
        const oldCookies = [
          'id_device=2; Max-Age=31536000; Path=/; Expires=Thu, 16 Jul 2026 20:08:22 GMT; HttpOnly; SameSite=Strict',
          'access_token=eyJsomethingbad.lol-asd; Max-Age=600; Path=/; Expires=Wed, 16 Jul 2025 20:18:22 GMT; HttpOnly; SameSite=Strict',
          'refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMDhlM2IyLTUyZDAtNGNjMy04NWNjLTU1ZDc5NTFkOWZmOSIsImp0aSI6IjJiZWM3MDBkLTZjNjEtNGNmNi05NzgxLTdlN2U3NTY3NDgxZiIsImlhdCI6MTc1MjY5NjUwMiwiZXhwIjoxNzUzMzAxMzAyfQ.7ZbRpVsCinjBvso8IymkxOffHdJR9URDRMqLw9LqLxk; Max-Age=604800; Path=/; Expires=Wed, 23 Jul 2025 20:08:22 GMT; HttpOnly; SameSite=Strict'
        ]
        await api.get('/api/v1/users/get-user').set('Cookie', oldCookies).expect(498)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing view user: Sending correct cookies', async () => {
      try {
        await api.get('/api/v1/users/get-user').set('Cookie', cookies).expect(200)
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })

  xdescribe('Updating basic info user testing', () => {
    test('Testing update basic info user: Not sending cookies', async () => {
      try {
        await api.patch('/api/v1/users/update-basic-user-info').expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Not sending a body', async () => {
      try {
        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Sending an empty object', async () => {
      try {
        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send({}).expect(304)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the name but sending an empty name', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const body = {
          name: ''
        }

        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the name but sending numbers', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const body = {
          name: 12345
        }

        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the name but sending a string of numbers', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const body = {
          name: '12345'
        }
        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the name but sending a string of simbols', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const body = {
          name: '@"#!'
        }
        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the name', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const body = {
          name: 'newName'
        }

        const response = await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(body)
        const user = await User.findByPk(id)

        expect(response.statusCode).toBe(200)
        expect(user).toBeTruthy()
        expect(user.name).toBe('newName')
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the name but it hasnt been 30 days', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const correctUpload = {
          name: 'newName'
        }
        const badUpload = {
          name: 'badName'
        }

        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(correctUpload).expect(200)
        const response = await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(badUpload)
        const user = await User.findByPk(id)

        expect(response.statusCode).toBe(403)
        expect(user).toBeTruthy()
        expect(user.name).toBe('newName')
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    // ------------------------------------------------------------------------------------------------------------

    test('Testing update basic info user: Updating only the lastname but sending an empty lastname', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const body = {
          lastName: ''
        }

        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the lastname but sending numbers', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const body = {
          lastName: 12345
        }

        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the lastname but sending a string of numbers', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const body = {
          lastName: '12345'
        }
        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the lastname but sending a string of simbols', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const body = {
          lastName: '@"#!'
        }
        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the name', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const body = {
          lastName: 'newLastName'
        }

        const response = await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(body)
        const user = await User.findByPk(id)

        expect(response.statusCode).toBe(200)
        expect(user).toBeTruthy()
        expect(user.lastName).toBe('newLastName')
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update basic info user: Updating only the name but it hasnt been 30 days', async () => {
      try {
        // NOTE Preparing user to interact with the endpoint
        await User.update({ lastUpdateBasicInfoUserByUser: null }, { where: { id } })
        const correctUpload = {
          lastName: 'newLastName'
        }
        const badUpload = {
          lastName: 'badLastName'
        }

        await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(correctUpload).expect(200)
        const response = await api.patch('/api/v1/users/update-basic-user-info').set('Cookie', cookies).send(badUpload)
        const user = await User.findByPk(id)

        expect(response.statusCode).toBe(403)
        expect(user).toBeTruthy()
        expect(user.lastName).toBe('newLastName')
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    // ------------------------------------------------------------------------------------------------------------

    test('Testing update phone user: Not sending cookies', async () => {
      try {
        await api.put('/api/v1/users/update-user-phone').expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update phone user: Not sending a body', async () => {
      try {
        await api.put('/api/v1/users/update-user-phone').set('Cookie', cookies).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update phone user: Sending an empty object', async () => {
      try {
        await api.put('/api/v1/users/update-user-phone').set('Cookie', cookies).send({}).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update phone user: Sending an empty phone', async () => {
      try {
        const body = {
          phone: ''
        }
        await api.put('/api/v1/users/update-user-phone').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update phone user: Sending letters', async () => {
      try {
        const body = {
          phone: 'asdfsadf'
        }
        await api.put('/api/v1/users/update-user-phone').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update phone user: Sending simbols', async () => {
      try {
        const body = {
          phone: '@"#$%&/('
        }
        await api.put('/api/v1/users/update-user-phone').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update phone user: Sending a short phone', async () => {
      try {
        const body = {
          phone: '1234'
        }
        await api.put('/api/v1/users/update-user-phone').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update phone user: Sending a long phone', async () => {
      try {
        const body = {
          phone: '1234123412341234'
        }
        await api.put('/api/v1/users/update-user-phone').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing update phone user: Sending a correct phone', async () => {
      try {
        const body = {
          phone: '35374821'
        }
        await api.put('/api/v1/users/update-user-phone').set('Cookie', cookies).send(body).expect(200)
        const user = await User.findByPk(id)
        expect(user).toBeTruthy()
        expect(user.phone).toBe('35374821')
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })

  xdescribe('Updating password user', () => {
    test('Testing changing user password: No sending cookies', async () => {
      try {
        await api.patch('/api/v1/users/update-password-user').expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: No sending a body', async () => {
      try {
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending an empty body', async () => {
      try {
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send({}).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending an empty params', async () => {
      try {
        const body = {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending an only letters oldPassword', async () => {
      try {
        const body = {
          oldPassword: 'asdfghjkl',
          newPassword: '@a1234567',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending an only numbers oldPassword', async () => {
      try {
        const body = {
          oldPassword: '123456789',
          newPassword: '@a1234567',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending an only simbols oldPassword', async () => {
      try {
        const body = {
          oldPassword: '@"#$%&/()',
          newPassword: '@a1234567',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending a short oldPassword', async () => {
      try {
        const body = {
          oldPassword: '1@3a',
          newPassword: '@a1234567',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending a long oldPassword', async () => {
      try {
        const body = {
          oldPassword: '1@3a1@3a1@3a1@3a1@3a1@3a1@3a1@3a1@3a',
          newPassword: '@a1234567',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending a empty oldPassword', async () => {
      try {
        const body = {
          oldPassword: '',
          newPassword: '@a1234567',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending a bad oldPassword', async () => {
      try {
        const body = {
          oldPassword: '@123e1238',
          newPassword: '@a1234567',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    // -----------------------------------------------------------------------------------------

    test('Testing changing user password: Sending an only letters newPassword', async () => {
      try {
        const body = {
          oldPassword: '@a1234567',
          newPassword: 'asdfghjkl',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending an only numbers newPassword', async () => {
      try {
        const body = {
          oldPassword: '@a1234567',
          newPassword: '123456789',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending an only simbols newPassword', async () => {
      try {
        const body = {
          oldPassword: '@a1234567',
          newPassword: '@"#$%&/()',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending a short newPassword', async () => {
      try {
        const body = {
          oldPassword: '@a1234567',
          newPassword: '1@3a',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending a long newPassword', async () => {
      try {
        const body = {
          oldPassword: '@a1234567',
          newPassword: '1@3a1@3a1@3a1@3a1@3a1@3a1@3a1@3a1@3a',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending a empty newPassword', async () => {
      try {
        const body = {
          oldPassword: '@a1234567',
          newPassword: '',
          confirmNewPassword: '@a1234567'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Sending a non equal confirmNewPassword and newPassword', async () => {
      try {
        const body = {
          oldPassword: '@1234567a',
          newPassword: '@a1234567',
          confirmNewPassword: '@1234567a'
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing changing user password: Validating the change', async () => {
      try {
        const body = {
          oldPassword: '@1234567a',
          newPassword: '@a1234567',
          confirmNewPassword: '@a1234567'
        }
        const oldPasswordLogin = {
          email: 'admin2@admin.com',
          password: '@1234567a',
          deviceId: 1
        }

        const newPasswordLogin = {
          email: 'admin2@admin.com',
          password: '@a1234567',
          deviceId: 1
        }
        await api.patch('/api/v1/users/update-password-user').set('Cookie', cookies).send(body).expect(200)

        // Verifing the invalidation of all token session
        const { count: countWhiteList, rows: rowsWhiteList } = await getAllDataOfTable(TokenWhiteList)
        expect(rowsWhiteList).toBeTruthy()
        expect(countWhiteList).toBe(0)
        const { count: countBlackList, rows: rowsBlackList } = await getAllDataOfTable(TokenBlackList)
        expect(rowsBlackList).toBeTruthy()
        expect(countBlackList).toBe(1)

        await api.post('/api/v1/users/login').send(oldPasswordLogin).expect(401)
        await api.post('/api/v1/users/login').send(newPasswordLogin).expect(200)
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })

  xdescribe('Add a new address logic testing', () => {
    beforeEach(async () => {
      await Promise.all([cleaningTable(UserAddress), cleaningTable(Address)])
    })

    afterEach(async () => {
      await Promise.all([cleaningTable(UserAddress), cleaningTable(Address)])
    })

    test('Testing adding an address: No sending cookies', async () => {
      try {
        await api.post('/api/v1/users/add-user-address').expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: No sending a body', async () => {
      try {
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending an empty body', async () => {
      try {
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send({}).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending an empty params', async () => {
      try {
        const body = {
          street: '',
          number: '',
          numDpto: '',
          postalCode: '',
          idCommune: ''
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Not sending the street', async () => {
      try {
        const body = {
          number: 4947,
          numDpto: 0,
          postalCode: '8650098',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending an street as a number', async () => {
      try {
        const body = {
          street: 0,
          number: 4947,
          numDpto: 0,
          postalCode: '8650098',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending an street with simbols', async () => {
      try {
        const body = {
          street: '@das@',
          number: 4947,
          numDpto: 0,
          postalCode: '8650098',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Not sending number', async () => {
      try {
        const body = {
          street: 'Toconao',
          numDpto: 0,
          postalCode: '8650098',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending the number as a string', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: '4947',
          numDpto: 0,
          postalCode: '8650098',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Not sending numDpto', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          postalCode: '8650098',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(200)
        const { count, rows } = await getAllDataOfTable(UserAddress)
        expect(rows).toBeTruthy()
        expect(count).toBe(1)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending numDpto as a string', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          numDpto: '0',
          postalCode: '8650098',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Not sending postalCode', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          numDpto: 0,
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending postalCode as a number', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          numDpto: 0,
          postalCode: 8650098,
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending a short postalCode', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          numDpto: 0,
          postalCode: '868',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending a long postalCode', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          numDpto: 0,
          postalCode: '86812312312312312',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Not sending idCommune', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          numDpto: 0,
          postalCode: '8650098'
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending a non exist idComune', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          numDpto: 0,
          postalCode: '8650098',
          idCommune: 100
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(404)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending an idComune as a string', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          numDpto: 0,
          postalCode: '8650098',
          idCommune: '100'
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending an incongruous postal code an street', async () => {
      try {
        const body = {
          street: 'random',
          number: 4947,
          numDpto: 0,
          postalCode: '8650098',
          idCommune: 18
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(404)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Trying to add the same address twice', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          numDpto: 0,
          postalCode: '8650098',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(200)
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(409)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Trying to more than 3 address at the same user', async () => {
      try {
        await Address.create({ id: 'bd37012a-bd79-416e-aac7-5e850686ed3d', street: 'str1', number: 12, numDpto: null, postalCode: 1234567, fk_id_commune: 12 })
        await Address.create({ id: 'bd37012a-bd79-416e-aac7-5e850686ed32', street: 'str2', number: 12, numDpto: null, postalCode: 1234567, fk_id_commune: 13 })
        await UserAddress.create({ id: 'bas7012a-bd79-416e-aac7-5e850686ed32', name: 'str1', fk_id_user: id, fk_id_address: 'bd37012a-bd79-416e-aac7-5e850686ed3d' })
        await UserAddress.create({ id: 'bas7012a-bd79-416e-aac7-5e85q626ed32', name: 'str2', fk_id_user: id, fk_id_address: 'bd37012a-bd79-416e-aac7-5e850686ed32' })
        const add1 = {
          street: 'Toconao',
          number: 4947,
          numDpto: 0,
          postalCode: '8650098',
          idCommune: 27
        }

        const add2 = {
          street: 'egipto',
          number: 142,
          numDpto: 0,
          postalCode: '9280060',
          idCommune: 18
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(add1).expect(200)
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(add2).expect(409)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing adding an address: Sending correct params', async () => {
      try {
        const body = {
          street: 'Toconao',
          number: 4947,
          numDpto: 0,
          postalCode: '8650098',
          idCommune: 27
        }
        await api.post('/api/v1/users/add-user-address').set('Cookie', cookies).send(body).expect(200)
        const { count, rows } = await getAllDataOfTable(UserAddress)
        expect(rows).toBeTruthy()
        expect(count).toBe(1)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    // -------------------------------------------------------------
  })

  xdescribe('Update an address testing', () => {
    beforeAll(async () => {
      await Promise.all([cleaningTable(UserAddress), cleaningTable(Address)])
      const adressToTest = await Address.create({ id: 'bd37012a-bd79-416e-aac7-5e850686ed3d', street: 'Toconao', number: 4947, numDpto: null, postalCode: 8650098, fk_id_commune: 27 })
      await UserAddress.create({ id: 'bas7012a-bd79-416e-aac7-5e850686ed32', name: 'str1', fk_id_user: id, fk_id_address: 'bd37012a-bd79-416e-aac7-5e850686ed3d' })
      if (!adressToTest) throw new Error('No address to update')
    })

    afterAll(async () => {
      await Promise.all([cleaningTable(UserAddress), cleaningTable(Address)])
    })

    test('Testing updating an user address: No sending cookies', async () => {
      try {
        await api.patch('/api/v1/users/update-user-address').expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: No sending a body', async () => {
      try {
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending an empty body', async () => {
      try {
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send({}).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending an empty params', async () => {
      try {
        const body = {
          idAddress: '',
          street: '',
          number: '',
          numDpto: '',
          postalCode: '',
          idCommune: ''
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending only the idAddress', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(304)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Changing to an invalid location', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          street: 'newStreet'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(404)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a number street', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          street: 12345
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a simbols street', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          street: '@213@'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a null street', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          street: null
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a undefined street', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          street: undefined
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(304)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a string as a number', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          number: '12345'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a null number', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          number: null
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a undefined number', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          number: undefined
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(304)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a number postalCode', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          postalCode: 12345
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a simbols postalCode', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          postalCode: '@213@'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a null postalCode', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          postalCode: null
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a undefined postalCode', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          postalCode: undefined
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(304)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a non exist idCommune', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          idCommune: 1234
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(404)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a string idCommune', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          idCommune: '12345'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a simbols idCommune', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          idCommune: '@213@'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a null idCommune', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          idCommune: null
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a undefined idCommune', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          idCommune: undefined
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(304)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    // ----
    test('Testing updating an user address: Sending a string numDpto', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          numDpto: '12345'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a simbols numDpto', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          numDpto: '@213@'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a null numDpto', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          numDpto: null
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Sending a undefined numDpto', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          numDpto: undefined
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(304)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Changing the location', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          street: 'Monte Verde',
          number: 1593,
          postalCode: '8650089'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(200)
        const addressChanged = await Address.findByPk('bd37012a-bd79-416e-aac7-5e850686ed3d')
        expect(addressChanged).toBeTruthy()
        expect(addressChanged.street).toBe('Monte Verde')
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing updating an user address: Changing the location to an existing one', async () => {
      try {
        const body = {
          idAddress: 'bd37012a-bd79-416e-aac7-5e850686ed3d',
          street: 'Monte Verde',
          number: 1593,
          postalCode: '8650089'
        }
        await api.patch('/api/v1/users/update-user-address').set('Cookie', cookies).send(body).expect(409)
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })

  describe('Deleting an address testing', () => {
    beforeAll(async () => {
      await Promise.all([cleaningTable(UserAddress), cleaningTable(Address)])
      const adressToTest = await Address.create({ id: 'bd37012a-bd79-416e-aac7-5e850686ed3d', street: 'Toconao', number: 4947, numDpto: null, postalCode: 8650098, fk_id_commune: 27 })
      await UserAddress.create({ id: 'bas7012a-bd79-416e-aac7-5e850686ed32', name: 'str1', fk_id_user: id, fk_id_address: 'bd37012a-bd79-416e-aac7-5e850686ed3d' })
      if (!adressToTest) throw new Error('No address to update')
    })

    afterAll(async () => {
      await Promise.all([cleaningTable(UserAddress), cleaningTable(Address)])
    })

    test('Testing deleting an address: No sending id', async () => {
      try {
        await api.delete('/api/v1/users/delete-user-address/').set('Cookie', cookies).expect(404)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing deleting an address: No sending cookies', async () => {
      try {
        await api.delete('/api/v1/users/delete-user-address/12321').expect(401)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing deleting an address: Attempt a short id', async () => {
      try {
        await api.delete('/api/v1/users/delete-user-address/1231').set('Cookie', cookies).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing deleting an address: Sending a long id', async () => {
      try {
        await api.delete('/api/v1/users/delete-user-address/1231241232112312412321123124123211231241232112312412321').set('Cookie', cookies).expect(400)
      } catch (error) {
        console.log(error)
        throw error
      }
    })

    test('Testing deleting an address: Sending a good id', async () => {
      try {
        await api.delete('/api/v1/users/delete-user-address/bd37012a-bd79-416e-aac7-5e850686ed3d').set('Cookie', cookies)
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  })
})
