/* eslint-disable no-undef */
import { app, server } from '../../app.js'
import supertest from 'supertest'

const api = supertest(app)

// NOTE loginUserController
describe('POST /login', () => {
  test('Attemp to login with correct params', async () => {
    const dataSend = {
      email: 'admin@admin.com',
      password: 'mora@1234',
      deviceId: 1
    }
    try {
      const response = await api
        .post('/api/v1/users/login')
        .send(dataSend)
      const newCookies = response.header['set-cookie']
      expect(newCookies).toBeTruthy()
      expect(newCookies.length).toBeGreaterThanOrEqual(3) // Adjust based on your actual cookie count
      expect(response.statusCode).toBe(200)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  test('Attemp to login with out the device info', async () => {
    const dataSend = {
      email: 'admin@admin.com',
      password: 'mora@1234'
    }
    try {
      const response = await api
        .post('/api/v1/users/login')
        .send(dataSend)
      const newCookies = response.header['set-cookie']
      expect(newCookies).toBeFalsy()
      expect(response.statusCode).toBe(403)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  // FIXME Do this
  test('Attemp to login with session cookies', async () => {
    const dataSend = {
      email: 'admin@admin.com',
      password: 'mora@1234'
    }
    try {
      const response = await api
        .post('/api/v1/users/login')
        .send(dataSend)
      const newCookies = response.header['set-cookie']
      expect(newCookies).toBeFalsy()
      expect(response.statusCode).toBe(403)
    } catch (error) {
      console.log(error)
      throw error
    }
  })
})

afterAll(() => {
  server.close()
})
