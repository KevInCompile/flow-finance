import { sql } from '@vercel/postgres'
import { expenseModel } from '../models/insert.model'

const GET_EXPENSES = (username: string | null | undefined) => sql`
  SELECT e.Id, a.Name AS AccountName, a.Id as accountid, c.Name AS CategoryName,
    e.Username, e.Date, e.Description, e.Value
  FROM expenses AS e
  INNER JOIN accounts AS a ON e.AccountId = a.Id
  INNER JOIN categories AS c ON e.CategoryId = c.Id
  WHERE e.Username=${username}`

const INSERT_EXPENSE = (
  expense: expenseModel,
) => sql`INSERT INTO expenses (AccountId, CategoryId, Username, Description, Date, Value)
  VALUES (${expense.accountId}, ${expense.categoryId}, ${expense.username}, ${expense.description}, ${expense.date}, ${expense.value})`

const UPDATE_ACCOUNT_EXPENSE = (expense: expenseModel) => sql`UPDATE accounts
  SET Value = Value - ${expense.value}
  WHERE Id = ${expense.accountId} AND Username = ${expense.username}`

const SELECT_EXPENSES_ACCOUNTS = (username: string) => sql`
  SELECT e.Id, a.Name AS AccountName, c.Name AS CategoryName, a.Id as accountid,
    e.Username, e.Date, e.Description, e.Value
  FROM expenses AS e
  INNER JOIN accounts AS a ON e.AccountId = a.Id
  INNER JOIN categories AS c ON e.CategoryId = c.Id
  WHERE e.Username=${username}
  ORDER BY Id DESC
  LIMIT 1`

const SELECT_EXPENSES = (id: string) => sql`SELECT * FROM expenses WHERE Id = ${id}`

const RETURN_EXPENSE = (expense: any) =>
  sql`UPDATE accounts SET Value = Value + ${parseFloat(expense.value)} WHERE Id = ${expense.accountid} and username = ${expense.username}`

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
