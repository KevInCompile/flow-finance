import { sql } from '@vercel/postgres'
import { expenseModel } from '../models/insert.model'

const GET_EXPENSES = (user_id: string | null | undefined) => sql`
    SELECT e.id, a.name AS AccountName, a.id as AccountId, c.name AS CategoryName,
    e.user_id, e.date_register, e.description, e.value, c.color
    FROM expenses AS e
    INNER JOIN accounts AS a ON e.account_id = a.id
    INNER JOIN categories AS c ON e.category_id = c.id
    WHERE e.user_id=${user_id}`

const INSERT_EXPENSE = (
  expense: expenseModel,
) => sql`INSERT INTO expenses (account_id, category_id, user_id, description, value)
  VALUES (${expense.accountid}, ${expense.categoryid}, ${expense.user_id}, ${expense.description}, ${expense.value})`

const UPDATE_ACCOUNT_EXPENSE = (expense: expenseModel) => sql`UPDATE accounts
  SET Value = Value - ${expense.value}
  WHERE id = ${expense.accountid} AND user_id = ${expense.user_id}`

const SELECT_EXPENSES_ACCOUNTS = (user_id: string) => sql`
    SELECT e.id, a.name AS AccountName, c.name AS CategoryName, a.id as accountid,
    e.user_id, e.date_register, e.description, e.value
    FROM expenses AS e
    INNER JOIN accounts AS a ON e.account_id = a.id
    INNER JOIN categories AS c ON e.category_id = c.id
    WHERE e.user_id=${user_id}
    ORDER BY e.id DESC
    LIMIT 1`

const SELECT_EXPENSES = (id: string) => sql`SELECT * FROM expenses WHERE id = ${id}`

const RETURN_EXPENSE = (expense: any) =>
  sql`UPDATE accounts SET value = value + ${parseFloat(expense.value)} WHERE id = ${expense.account_id} and user_id = ${expense.user_id}`

const DELETE_EXPENSE = (expense: any) =>
  sql`DELETE FROM expenses WHERE Id = ${expense.id} and user_id = ${expense.user_id}`

export {
  GET_EXPENSES,
  INSERT_EXPENSE,
  UPDATE_ACCOUNT_EXPENSE,
  SELECT_EXPENSES_ACCOUNTS,
  SELECT_EXPENSES,
  RETURN_EXPENSE,
  DELETE_EXPENSE,
}
