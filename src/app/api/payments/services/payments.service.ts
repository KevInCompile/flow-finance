import { sql } from '@vercel/postgres'

const SELECT_PAYMENTS = (id: string) => sql`SELECT debts_id, pay_value FROM payments WHERE id = ${id}`

const UPDATE_PAYMENTS = (payvalue: number, debtsid: number) =>
  sql`UPDATE debts SET total_due = total_due + ${payvalue} where id = ${debtsid}`

const DELETE_PAYMENTS = (id: string) => {
  return sql`DELETE FROM payments where id = ${id}`
}

const INSERT_PAYMENTS = (debtID: number, paymentType: string, payFormatted: number) => {
  return sql`INSERT INTO payments (debts_id, payment_type, pay_value) VALUES (${debtID}, ${paymentType}, ${payFormatted})`
}

const UPDATE_FORMATT_PAYMENTS = (payFormatted: number, debtID: number) => {
  return sql`UPDATE debts SET total_due = total_due - ${payFormatted} where id = ${debtID}`
}

export { SELECT_PAYMENTS, UPDATE_PAYMENTS, DELETE_PAYMENTS, INSERT_PAYMENTS, UPDATE_FORMATT_PAYMENTS }
