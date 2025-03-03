import { sql } from '@vercel/postgres'

const INSERT_DEBTS = (
  username: string | null | undefined,
  installments: number,
  description: string,
  paydate: number,
  startdate: string,
  totalamount: number,
  interest: number

) =>
  sql`INSERT INTO debts (username, installments, description, interest, total_amount, start_date, pay_date)
      VALUES (${username}, ${installments}, ${description}, ${+interest}, ${totalamount}, ${startdate}, ${paydate})`

const GET_DEBTS = (username: string | null | undefined) => sql`SELECT * FROM debts where Username = ${username}`

const GET_DEBTS_PAYMENTS = (id: number) => sql`SELECT * FROM payments WHERE debts_id = ${id}`

const DELETE_DEBTS = (username: string | null | undefined, id: number) => {
  sql`DELETE FROM payments WHERE debtsid = ${id}`
  sql`DELETE FROM debts WHERE id = ${id} AND username = ${username}`
}

export { INSERT_DEBTS, GET_DEBTS, GET_DEBTS_PAYMENTS, DELETE_DEBTS }
