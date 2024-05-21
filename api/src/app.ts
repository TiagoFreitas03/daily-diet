import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { userRoutes } from './routes/users'
import { mealRoutes } from './routes/meals'

const app = fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: 'users',
})

app.register(mealRoutes, {
  prefix: 'meals',
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
