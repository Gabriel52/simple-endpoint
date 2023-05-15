import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/', async (request, response) => {
  const table = await knex('sqlite_schema').select('*')
  return table
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
