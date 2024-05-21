// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
    }

    meals: {
      id: string
      user_id: string
      name: string
      description: string
      date: number
      is_in_diet: boolean
      created_at: string
    }
  }
}
