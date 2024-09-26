'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AccountModel } from '../models/account.model'
import accountsFetch from '../services/AccountsFetch'

export default function useAccounts() {
  const [data, setData] = useState<AccountModel[]>([])
  const [loading, setLoading] = useState(true)

  const getData = async () => {
    try {
      const [error, result] = await accountsFetch()
      if (error) return toast.error(error)
      setData(result)
      setLoading(false)
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return { data, loading, setData }
}
