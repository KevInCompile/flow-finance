'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { SavingGoalModel } from '../models/saving-goals.model'
import serviceGetSavingGoals from '../services/saving-goals.service'

export default function useSavingGoals() {
  const [data, setData] = useState<SavingGoalModel[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    const getData = async (user: string) => {
      try {
        const [error, result] = await serviceGetSavingGoals(user)
        if (error) return toast.error(error)
        setData(result.result)
      } catch (e) {
      } finally {
        setLoading(false)
      }
    }
    getData(params.user as string)
  }, [])

  return { data, loading, setData }
}
