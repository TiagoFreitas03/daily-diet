import { FastifyInstance, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

import { checkUserExists } from '../middlewares/check-user-exists'
import { database } from '../database'

export async function mealRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUserExists)

  function validateBodySchema(request: FastifyRequest) {
    const mealSchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isInDiet: z.boolean(),
    })

    const data = mealSchema.parse(request.body)

    return data
  }

  app.post('/', async (request, reply) => {
    const { name, description, date, isInDiet } = validateBodySchema(request)

    const { userId } = request.cookies

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

  app.put('/:id', async (request, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateMealParamsSchema.parse(request.params)
    const { userId } = request.cookies
    const { name, description, date, isInDiet } = validateBodySchema(request)

    await database('meals')
      .update({
        name,
        description,
        date: date.getTime(),
        is_in_diet: isInDiet,
      })
      .where({
        id,
        user_id: userId,
      })

    return reply.status(204).send()
  })
}
