import { sql } from '@vercel/postgres'
import { expenseModel } from '../models/insert.model'

const GET_EXPENSES = (username: string | null | undefined) => sql`
    SELECT e.id, a.name AS AccountName, a.id as AccountId, c.name AS CategoryName,
    e.username, e.date_register, e.description, e.value, c.color
    FROM expenses AS e
    INNER JOIN accounts AS a ON e.account_id = a.id
    INNER JOIN categories AS c ON e.category_id = c.id
    WHERE e.username=${username}`

const INSERT_EXPENSE = (
  expense: expenseModel,
) => sql`INSERT INTO expenses (account_id, category_id, username, description, value)
  VALUES (${expense.accountid}, ${expense.categoryid}, ${expense.username}, ${expense.description}, ${expense.value})`

const UPDATE_ACCOUNT_EXPENSE = (expense: expenseModel) => sql`UPDATE accounts
  SET Value = Value - ${expense.value}
  WHERE id = ${expense.accountid} AND username = ${expense.username}`

const SELECT_EXPENSES_ACCOUNTS = (username: string) => sql`
    SELECT e.id, a.name AS AccountName, c.name AS CategoryName, a.id as accountid,
    e.username, e.date_register, e.description, e.value
    FROM expenses AS e
    INNER JOIN accounts AS a ON e.account_id = a.id
    INNER JOIN categories AS c ON e.category_id = c.id
    WHERE e.username=${username}
    ORDER BY e.id DESC
    LIMIT 1`

const SELECT_EXPENSES = (id: string) => sql`SELECT * FROM expenses WHERE id = ${id}`

const RETURN_EXPENSE = (expense: any) =>
  sql`UPDATE accounts SET value = value + ${parseFloat(expense.value)} WHERE id = ${expense.account_id} and username = ${expense.username}`

const DELETE_EXPENSE = (expense: any) =>
  sql`DELETE FROM expenses WHERE Id = ${expense.id} and username = ${expense.username}`

export {
  GET_EXPENSES,
  INSERT_EXPENSE,
  UPDATE_ACCOUNT_EXPENSE,
  SELECT_EXPENSES_ACCOUNTS,
  SELECT_EXPENSES,
  RETURN_EXPENSE,
  DELETE_EXPENSE,
}
