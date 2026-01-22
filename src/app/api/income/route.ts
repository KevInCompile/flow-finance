import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { getSession } from '../session'
import { authMiddleware } from '../middleware/auth'

export const POST = authMiddleware(async (request, session) => {
  const form = await request.json()
  const { typeIncome, value: valueString, accountId, date } = form
  const value = parseFloat(valueString)

  try {
    // Insert income
    await sql`INSERT INTO incomes (user_id, type_income, account_id, value, date) VALUES (${session.user?.id}, ${typeIncome}, ${accountId}, ${value}, ${date})`
    // Recuperar el ultimo registro de ese usuario
    const { rows } =
      await sql`SELECT I.id, I.value, I.type_income, I.date, C.name as account, I.account_id FROM incomes as I INNER JOIN accounts as C ON I.account_id = C.id where I.user_id = ${session.user?.id} ORDER BY Id DESC LIMIT 1`
    // Eliminar el valor sumado de la cuenta
    await sql`UPDATE accounts SET value = value + ${value} where id = ${accountId}`

    return NextResponse.json({ message: 'Income register', result: rows[0] }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
})

export const GET = authMiddleware(async (_, session) => {
  try {
    const result =
      await sql`SELECT I.id, I.value, I.type_income, I.date as date_register, C.name as account, I.account_id FROM incomes as I INNER JOIN accounts as C ON I.account_id = C.id where I.user_id = ${session.user?.id}`

    return NextResponse.json({ result: result.rows }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
})

export const DELETE = authMiddleware(async (req) => {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try {
    const { rows } = await sql`SELECT value, account_id FROM incomes where Id = ${id}`
    await sql`UPDATE accounts SET value = value - ${parseFloat(rows[0].value)} where id = ${rows[0].account_id}`
    await sql`DELETE FROM incomes where id = ${id}`
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }

  return NextResponse.json({ message: 'Income delete' }, { status: 200 })
})
