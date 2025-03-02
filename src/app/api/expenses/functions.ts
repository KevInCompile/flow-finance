import {
  DELETE_EXPENSE,
  INSERT_EXPENSE,
  RETURN_EXPENSE,
  SELECT_EXPENSES,
  SELECT_EXPENSES_ACCOUNTS,
  UPDATE_ACCOUNT_EXPENSE,
} from './services/expenses.service'
import { expenseModel } from './models/insert.model'

export async function insertExpense(form: expenseModel) {
  const { username, value: valueString, accountid, categoryid, description, date } = form
  const value = parseFloat(valueString.toLocaleString())

  await INSERT_EXPENSE({ accountid, categoryid, username, description, value })
  await UPDATE_ACCOUNT_EXPENSE({ accountid, value, username })

  const { rows } = await SELECT_EXPENSES_ACCOUNTS(username!)

  return rows[0]
}

export async function deleteExpense(id: string, username: string | null | undefined) {
  const { rows } = await SELECT_EXPENSES(id)
  const expense = rows[0]

  if (expense.value) {
    await RETURN_EXPENSE({ value: expense.value, accountid: expense.accountid, username })
  }

  await DELETE_EXPENSE({ id: expense.id, username })
}
