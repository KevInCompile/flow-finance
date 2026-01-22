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
  const { user_id, value: valueString, accountid, categoryid, description, date } = form
  const value = parseFloat(valueString.toLocaleString())

  await INSERT_EXPENSE({ accountid, categoryid, user_id, description, value })
  await UPDATE_ACCOUNT_EXPENSE({ accountid, value, user_id })

  const { rows } = await SELECT_EXPENSES_ACCOUNTS(user_id!)

  return rows[0]
}

export async function deleteExpense(id: string, user_id: string | null | undefined) {
  const { rows } = await SELECT_EXPENSES(id)
  const expense = rows[0]

  if (expense.value) {
    await RETURN_EXPENSE({ value: expense.value, account_id: expense.account_id, user_id })
  }

  await DELETE_EXPENSE({ id: expense.id, user_id })
}
