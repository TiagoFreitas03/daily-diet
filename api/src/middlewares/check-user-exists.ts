import { FastifyReply, FastifyRequest } from 'fastify'

import { database } from '../database'

export async function checkUserExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId } = request.cookies

  if (!userId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }

  const user = await database('users').where({ id: userId }).first()

  if (!user) {
    return reply.status(404).send({
      error: 'User not found',
    })
  }
}
