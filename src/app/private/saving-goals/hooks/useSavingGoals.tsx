'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { SavingGoalModel } from '../models/saving-goals.model'
import serviceGetSavingGoals from '../services/saving-goals.service'

export default function useSavingGoals() {
  const [data, setData] = useState<SavingGoalModel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        const [error, result] = await serviceGetSavingGoals()
        if (error) return toast.error(error)
        return setData(result.result)
      } catch (e) {
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  return { data, loading, setData }
}
