'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import debtsFetch from '../services/DebtsFetch'
import { Debt } from '../models/debts.models'
import deleteDebt from '../services/delete-debt.service'

export default function useDebts() {
  const [data, setData] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)

  const getData = async () => {
    try {
      const [error, result] = await debtsFetch()
      if (error) return toast.error(error)
      setData(result)
      setLoading(false)
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  const actionDelete = async (id: number) => {
    const [error, message] = await deleteDebt(id)
    if (error) return toast.error(error)
    setData(data.filter((item) => item.id !== id))
    return toast.success(message)
  }

  useEffect(() => {
    getData()
  }, [])

  return { data, loading, setData, actionDelete }
}
