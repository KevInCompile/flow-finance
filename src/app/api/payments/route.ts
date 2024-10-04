import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { authMiddleware } from '../middleware/auth'
import { SELECT_PAYMENTS } from './services/payments.service'

export const POST = authMiddleware(async (req) => {
  const form = await req.json()
  const { debtID, paymentType, payValue } = form
  const payFormatted = parseFloat(payValue!.toString().replace(/,/g, ''))

  try {
    if (!debtID) return NextResponse.json({ error: 'Debt not found' }, { status: 500 })

    // INSERT TO SQL
    await sql`INSERT INTO payments (DebtsId, PaymentType, PayValue) VALUES (${debtID}, ${paymentType}, ${payFormatted})`

    await sql`UPDATE debts SET TotalDue = TotalDue - ${payFormatted} where Id = ${debtID}`
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ message: 'ok' }, { status: 200 })
})

export const DELETE = authMiddleware(async (req) => {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try {
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 500 })

    const result = await SELECT_PAYMENTS(id)
    const { debtsid, payvalue } = result.rows[0]
    if (payvalue) {
      await sql`UPDATE debts SET TotalDue = TotalDue + ${payvalue} where Id = ${debtsid}`
      await sql`DELETE FROM payments where Id = ${id}`
    }
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
  return NextResponse.json({ message: 'payment deleted!' }, { status: 200 })
})
