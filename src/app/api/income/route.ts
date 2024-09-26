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
    await sql`INSERT INTO incomes (Username, TypeIncome, AccountId, Value, Date) VALUES (${session.user?.name}, ${typeIncome}, ${accountId}, ${value}, ${date})`
    // Recuperar el ultimo registro de ese usuario
    const { rows } =
      await sql`SELECT I.id, I.value, I.typeincome, I.date, C.name as account, I.AccountId FROM incomes as I INNER JOIN accounts as C ON I.AccountId = C.Id where I.Username = ${session.user?.name} ORDER BY Id DESC LIMIT 1`
    // Eliminar el valor sumado de la cuenta
    await sql`UPDATE accounts SET Value = Value + ${value} where Id = ${accountId}`

    return NextResponse.json({ message: 'Income register', result: rows[0] }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  try {
    const result =
      await sql`SELECT I.id, I.value, I.typeincome, I.date, C.name as account, I.AccountId FROM incomes as I INNER JOIN accounts as C ON I.AccountId = C.Id where I.Username = ${session.user?.name}`

    return NextResponse.json({ result: result.rows }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try {
    const { rows } = await sql`SELECT Value, AccountId FROM incomes where Id = ${id}`
    await sql`UPDATE accounts SET Value = Value - ${parseFloat(rows[0].value)} where Id = ${rows[0].accountid}`
    await sql`DELETE FROM incomes where Id = ${id}`
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }

  return NextResponse.json({ message: 'Income delete' }, { status: 200 })
}
