import { it, expect, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/server'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New HD',
      amount: 400,
      type: 'debit',
    })

    expect(response.statusCode).to.equal(201)
  })
})
