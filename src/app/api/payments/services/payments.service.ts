import { sql } from '@vercel/postgres'

const SELECT_PAYMENTS = (id: string) => sql`SELECT DebtsId, PayValue FROM payments WHERE Id = ${id}`

export { SELECT_PAYMENTS }
