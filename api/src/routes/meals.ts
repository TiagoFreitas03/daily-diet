import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

import { checkUserExists } from '../middlewares/check-user-exists'
import { database } from '../database'

export async function mealRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUserExists)

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isInDiet: z.boolean(),
    })

    const { userId } = request.cookies

    const { name, description, date, isInDiet } = createMealBodySchema.parse(
      request.body,
    )

    await database('meals').insert({
      id: randomUUID(),
      name,
      description,
      date: date.getTime(),
      is_in_diet: isInDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })
}
