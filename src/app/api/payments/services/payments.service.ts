import { sql } from '@vercel/postgres'

const SELECT_PAYMENTS = (id: string) => sql`SELECT DebtsId, PayValue FROM payments WHERE Id = ${id}`

const UPDATE_PAYMENTS = (payvalue: number, debtsid: number) =>
  sql`UPDATE debts SET TotalDue = TotalDue + ${payvalue} where Id = ${debtsid}`

const DELETE_PAYMENTS = (id: string) => {
  return sql`DELETE FROM payments where Id = ${id}`
}

const INSERT_PAYMENTS = (debtID: number, paymentType: string, payFormatted: number) => {
  return sql`INSERT INTO payments (DebtsId, PaymentType, PayValue) VALUES (${debtID}, ${paymentType}, ${payFormatted})`
}

const UPDATE_FORMATT_PAYMENTS = (payFormatted: number, debtID: number) => {
  return sql`UPDATE debts SET TotalDue = TotalDue - ${payFormatted} where Id = ${debtID}`
}

export { SELECT_PAYMENTS, UPDATE_PAYMENTS, DELETE_PAYMENTS, INSERT_PAYMENTS, UPDATE_FORMATT_PAYMENTS }
