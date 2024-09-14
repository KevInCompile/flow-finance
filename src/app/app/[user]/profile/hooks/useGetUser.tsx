'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUser } from '../services/get-user.service'

export default function useGetUser() {
  const [currency, setCurrency] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataSaved, setDataSaved] = useState(false)
  const { user } = useParams()

  async function fetchUserCurrency() {
    setLoading(true)
    const [error, result] = await getUser(user as string)
    setLoading(false)
    setCurrency(result)
  }

  useEffect(() => {
    fetchUserCurrency()
  }, [dataSaved])

  return { currency, loading, setDataSaved }
}
