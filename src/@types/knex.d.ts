// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/table' {
  export interface Tables {
    transactions: {
      id: string
      titles: string
      amount: string
      created_at: string
      session_id?: string
    }
  }
}
