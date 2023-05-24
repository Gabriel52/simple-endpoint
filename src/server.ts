import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(cookie)

app.addHook('preHandler', async (request, response) => {
  console.log(`[${request.method}] ${request.url}`)
})
app.register(transactionsRoutes, {
  prefix: 'transactions',
})

const PORT = 3333
app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`listening on port ${PORT}`)
  })
  .catch((err) => {
    console.log(err)
  })
