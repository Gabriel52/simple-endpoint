import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionsIdExists(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const sessionId = request.cookies.sessionsId

  if (!sessionId) {
    return response.status(401).send({ data: 'Unauthorized user', error: true })
  }
}
