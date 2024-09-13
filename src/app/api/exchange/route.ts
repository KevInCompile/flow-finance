import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

type ExchangeForm = {
  username: string
  fromAccountId: string
  toAccountId: string
  value: string
}
async function performExchange(form: ExchangeForm) {
  const { username: userEncode, fromAccountId, toAccountId, value } = form
  // const value = parseFloat(valueString.replace(/,/g, ''))
  const username = decodeURIComponent(userEncode)

  try {
    // Deduct from the source account
    await sql`UPDATE accounts
      SET Value = Value - ${+value}
      WHERE Id = ${+fromAccountId} AND Username = ${username}`

    // Add to the destination account
    await sql`UPDATE accounts
      SET Value = Value + ${+value}
      WHERE Id = ${+toAccountId} AND Username = ${username}`

    // Record the exchange transaction
    await sql`INSERT INTO exchanges (FromAccountId, ToAccountId, Username, Value)
      VALUES (${+fromAccountId}, ${+toAccountId}, ${username}, ${+value})`

    // Fetch the newly created exchange record
    const { rows } = await sql`
      SELECT e.Id, a1.Name AS FromAccountName, a2.Name AS ToAccountName,
        e.Username, e.Date, e.Value
      FROM exchanges AS e
      INNER JOIN accounts AS a1 ON e.FromAccountId = a1.Id
      INNER JOIN accounts AS a2 ON e.ToAccountId = a2.Id
      WHERE e.Username=${username}
      ORDER BY Id DESC
      LIMIT 1`

    return rows[0]
  } catch (error) {
    // If there's an error, rollback the transaction
    await sql`ROLLBACK`
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.json()
    console.log('adsa')
    const result = await performExchange(form)
    return NextResponse.json(
      {
        message: 'Exchange completed',
        result: { ...result, type: 'exchange' },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
