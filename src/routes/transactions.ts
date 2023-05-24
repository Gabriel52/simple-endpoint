import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionsIdExists } from '../middleware/check-session-id'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    )
    let sessionsId = request.cookies.sessionsId
    if (!sessionsId) {
      sessionsId = randomUUID()

      response.cookie('sessionsId', sessionsId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      })
    }
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      sessions_Id: sessionsId,
    })
    response
      .status(201)
      .send({ error: false, data: 'transaction created successfully' })
  })

  app.get(
    '/:id',
    { preHandler: [checkSessionsIdExists] },
    async (request, response) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { sessionsId } = request.cookies
      const { id } = getTransactionParamsSchema.parse(request.params)

      const transaction = await knex('transactions')
        .where('id', id)
        .andWhere('sessions_id', sessionsId)
        .first()

      return {
        transaction,
      }
    },
  )

  app.get(
    '/summary',
    { preHandler: [checkSessionsIdExists] },
    async (request, response) => {
      const { sessionsId } = request.cookies

      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where('sessions_id', sessionsId)
        .first()
      return { summary }
    },
  )

  app.get(
    '/',
    { preHandler: [checkSessionsIdExists] },
    async (request, response) => {
      const { sessionsId } = request.cookies

      const transactions = await knex('transactions')
        .where('sessions_id', sessionsId)
        .select()
      return {
        transactions,
      }
    },
  )
}
