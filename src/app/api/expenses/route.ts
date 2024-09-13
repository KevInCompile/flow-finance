import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

type ExpenseForm = {
  username: string
  value: string
  accountId: string
  categoryId: string
  description: string
}

async function insertExpense(form: ExpenseForm) {
  const {
    username: userEncode,
    value: valueString,
    accountId,
    categoryId,
    description,
  } = form
  const value = parseFloat(valueString.replace(/,/g, ''))
  const username = decodeURIComponent(userEncode)

  await sql`INSERT INTO expenses (AccountId, CategoryId, Username, Description, Value)
    VALUES (${+accountId}, ${+categoryId}, ${username}, ${description}, ${value})`
  await sql`UPDATE accounts
    SET Value = Value - ${value}
    WHERE Id = ${accountId} AND Username = ${username}`

  const { rows } = await sql`
    SELECT e.Id, a.Name AS AccountName, c.Name AS CategoryName, a.Id as accountid,
      e.Username, e.Date, e.Description, e.Value
    FROM expenses AS e
    INNER JOIN accounts AS a ON e.AccountId = a.Id
    INNER JOIN categories AS c ON e.CategoryId = c.Id
    WHERE e.Username=${username}
    ORDER BY Id DESC
    LIMIT 1`

  return rows[0]
}

export async function POST(request: Request) {
  try {
    const form = await request.json()
    const result = await insertExpense(form)
    return NextResponse.json(
      { message: 'Expense added', result: { ...result, type: 'expense' } },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  try {
    const result = await sql`
      SELECT e.Id, a.Name AS AccountName, a.Id as accountid, c.Name AS CategoryName,
        e.Username, e.Date, e.Description, e.Value
      FROM expenses AS e
      INNER JOIN accounts AS a ON e.AccountId = a.Id
      INNER JOIN categories AS c ON e.CategoryId = c.Id
      WHERE e.Username=${username}`

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
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Id is missing' }, { status: 500 })

  try {
    const result = await sql`SELECT * FROM expenses WHERE Id = ${id}`
    const expense = result.rows[0]

    if (expense.value) {
      await sql`UPDATE accounts SET Value = Value + ${expense.value} WHERE Id = ${expense.accountid}`
    }

    await sql`DELETE FROM expenses WHERE Id = ${id}`
    return NextResponse.json({ message: 'Expense deleted' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
