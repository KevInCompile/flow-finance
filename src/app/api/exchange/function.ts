import { sql } from '@vercel/postgres'

type ExchangeForm = {
  username: string
  fromAccountId: string
  toAccountId: string
  value: string
}

export async function performExchange(form: ExchangeForm) {
  const { username, fromAccountId, toAccountId, value } = form

  try {
    // Deduct from the source account
    await sql`UPDATE accounts
      SET value = value - ${+value}
      WHERE id = ${+fromAccountId} AND username = ${username}`

    // Add to the destination account
    await sql`UPDATE accounts
      SET Value = Value + ${+value}
      WHERE id = ${+toAccountId} AND username = ${username}`

    // Record the exchange transaction
    await sql`INSERT INTO exchanges (from_account_id, to_account_id, username, value)
      VALUES (${+fromAccountId}, ${+toAccountId}, ${username}, ${+value})`

    // Fetch the newly created exchange record
    const { rows } = await sql`
      SELECT e.id, a1.name AS FromAccountName, a2.name AS ToAccountName,
        e.Username, e.Date, e.Value
      FROM exchanges AS e
      INNER JOIN accounts AS a1 ON e.from_account_id = a1.Id
      INNER JOIN accounts AS a2 ON e.to_account_id = a2.Id
      WHERE e.username=${username}
      ORDER BY Id DESC
      LIMIT 1`

    return rows[0]
  } catch (error) {
    // If there's an error, rollback the transaction
    await sql`ROLLBACK`
    throw error
  }
}
