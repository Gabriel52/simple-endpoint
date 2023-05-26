import { it, beforeAll, afterAll, describe, expect } from 'vitest'
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
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New HD',
        amount: 400,
        type: 'debit',
      })
      .expect(201)
  })

  it('should be able see all transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New HD',
        amount: 400,
        type: 'credit',
      })
    const cookies = createTransactionResponse.get('Set-Cookie')
    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)
    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New HD',
        amount: 400,
      }),
    ])
  })
})
