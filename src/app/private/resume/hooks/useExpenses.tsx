import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ExpensesFetch from '../services/expenses.service'
import serviceDeleteExpense from '../services/delete-expense.service'

export interface ExpenseModel {
  id: number
  value: number
  accountname: string
  categoryname: string
  date: string
  description: string
  type: string
  typeincome?: string
  details?: ExpenseModel[]
}
export default function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseModel[]>([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  const deleteExpense = async (id: number) => {
    const [error, response] = await serviceDeleteExpense(id)
    if (error) return toast.error(error)
    setExpenses((prevState) => prevState.filter((item) => item.id !== id))
    toast.success(response)
  }

  useEffect(() => {
    const getData = async () => {
      const [error, result] = await ExpensesFetch()
      if (error) return toast(error)
      setExpenses(result)
      setLoading(false)
    }
    getData()

    return () => setRefresh(false)
  }, [refresh])

  return { loading, expenses, setRefresh, setExpenses, deleteExpense }
}
