import { toast } from 'sonner'
import createExpense from '../actions/expense.actions'
import { SetStateAction } from 'react'
import { ExpenseModel } from '../hooks/useExpenses'

export const handleExpenseHelper = async (
  data: any,
  fecha: string,
  value: string,
  setLoading: (loading: boolean) => void,
  setExpenses: React.Dispatch<SetStateAction<ExpenseModel[]>>,
  addNewValue: (type: string) => void
) => {
  setLoading(true)
  const [error, response] = await createExpense({
    accountid: data.accountid,
    categoryid: data.categoryid,
    description: data.description,
    date: fecha,
    value,
  })
  if (error) return toast.warning('Ups!...')
  setExpenses((prevState) => [...prevState, response.result])
  addNewValue('expense')
  setLoading(false)
  return toast.success('New expense add!')
}
