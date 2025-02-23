import { sql } from '@vercel/postgres'

const INSERT_DEBTS = (
  username: string | null | undefined,
  fee: string,
  description: string,
  payday: string,
  totaldue: number,
  datestart: string,
  dateend: string,
  interest: number,

) =>
  sql`INSERT INTO debts (Username, Fee, Description, TotalDue, DateStart, DateEnd, Interest) VALUES (${username}, ${fee}, ${description}, ${totaldue}, ${payday}, ${datestart}, ${dateend}, ${interest})`

const GET_DEBTS = (username: string | null | undefined) => sql`SELECT * FROM debts where Username = ${username}`

const GET_DEBTS_PAYMENTS = (id: number) => sql`SELECT * FROM payments WHERE DebtsId = ${id}`

const DELETE_DEBTS = (username: string | null | undefined, id: number) =>
  sql`DELETE FROM debts WHERE id = ${id} AND username = ${username}`

export { INSERT_DEBTS, GET_DEBTS, GET_DEBTS_PAYMENTS, DELETE_DEBTS }
