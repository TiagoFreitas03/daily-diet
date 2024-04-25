import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

import { database } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    const userExists = await database('users').where({ email }).first()

    if (userExists) {
      return reply.status(400).send({
        error: 'User alredy exists',
      })
    }

    const userId = randomUUID()

    await database('users').insert({
      id: userId,
      name,
      email,
    })

    reply.cookie('userId', userId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send()
  })
}
