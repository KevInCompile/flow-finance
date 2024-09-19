import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { getSession } from '../session'
import { insertExpense } from './functions'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  try {
    const form = await request.json()
    const result = await insertExpense({
      username: session.user?.name,
      ...form,
    })
    return NextResponse.json(
      { message: 'Expense added', result: { ...result, type: 'expense' } },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function GET() {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  try {
    const result = await sql`
      SELECT e.Id, a.Name AS AccountName, a.Id as accountid, c.Name AS CategoryName,
        e.Username, e.Date, e.Description, e.Value
      FROM expenses AS e
      INNER JOIN accounts AS a ON e.AccountId = a.Id
      INNER JOIN categories AS c ON e.CategoryId = c.Id
      WHERE e.Username=${session.user?.name}`

    return NextResponse.json(
      {
        result: result.rows.map((row: any) => ({ ...row, type: 'expense' })),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Id is missing' }, { status: 500 })

  try {
    const result = await sql`SELECT * FROM expenses WHERE Id = ${id}`
    const expense = result.rows[0]

    if (expense.value) {
      await sql`UPDATE accounts SET Value = Value + ${parseFloat(expense.value)} WHERE Id = ${expense.accountid} and username = ${session.user?.name}`
    }

    await sql`DELETE FROM expenses WHERE Id = ${id} and username = ${session.user?.name}`
    return NextResponse.json({ message: 'Expense deleted' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
