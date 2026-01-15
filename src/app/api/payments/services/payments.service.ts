import { sql } from '@vercel/postgres'

const SELECT_PAYMENTS = (id: string) => sql`SELECT debts_id, pay_value FROM payments WHERE id = ${id}`

const UPDATE_PAYMENTS = (payvalue: number, debtsid: number) =>
  sql`UPDATE debts SET total_due = total_due + ${payvalue} where id = ${debtsid}`

const DELETE_PAYMENTS = (id: string) => {
  return sql`DELETE FROM payments where id = ${id}`
}

const INSERT_PAYMENTS = (debtID: number, paymentType: string, payFormatted: number, capitalPaid?: number, interestPaid?: number) => {
  // Si no se proporcionan capitalPaid e interestPaid, calcularlos basados en el estado actual de la deuda
  if (capitalPaid === undefined || interestPaid === undefined) {
    // Por defecto, asumir que todo es capital (para pagos sin interés o donde no se especifica)
    capitalPaid = payFormatted
    interestPaid = 0
  }
  
  return sql`INSERT INTO payments (debts_id, payment_type, pay_value, capital_paid, interest_paid) 
             VALUES (${debtID}, ${paymentType}, ${payFormatted}, ${capitalPaid}, ${interestPaid})`
}

const UPDATE_FORMATT_PAYMENTS = (payFormatted: number, debtID: number) => {
  return sql`UPDATE debts SET total_due = total_due - ${payFormatted} where id = ${debtID}`
}

export { SELECT_PAYMENTS, UPDATE_PAYMENTS, DELETE_PAYMENTS, INSERT_PAYMENTS, UPDATE_FORMATT_PAYMENTS }
