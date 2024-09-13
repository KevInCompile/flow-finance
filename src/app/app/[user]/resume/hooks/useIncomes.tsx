import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { serviceIncomes } from '../services/incomes.service'
import deleteIncomeService from '../services/delete-income.service'
import { toast } from 'sonner'
import { IncomeModel } from '../models/IncomeModel'

export default function useIncomes() {
  const [data, setData] = useState<IncomeModel[]>([])
  const { user } = useParams()

  const getData = async () => {
    const response = await serviceIncomes(user as string)
    if (response.length) return setData(response)
    return setData([])
  }

  const deleteIncome = async (id: number) => {
    const [error, message] = await deleteIncomeService(id)
    if (error) {
      toast.error(error)
    } else {
      toast.success(message)
      setData(data.filter((item) => item.id !== id))
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return {
    data,
    deleteIncome,
    setData,
  }
}
