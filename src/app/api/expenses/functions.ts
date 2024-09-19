import { sql } from '@vercel/postgres'

type ExpenseForm = {
  username: string
  value: string
  accountId: string
  categoryId: string
  description: string
  date: string
}

export async function insertExpense(form: ExpenseForm) {
  const {
    username,
    value: valueString,
    accountId,
    categoryId,
    description,
    date,
  } = form
  const value = parseFloat(valueString)

  await sql`INSERT INTO expenses (AccountId, CategoryId, Username, Description, Date, Value)
    VALUES (${accountId}, ${categoryId}, ${username}, ${description}, ${date}, ${value})`
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
