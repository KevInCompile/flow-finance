'use client'

import { useEffect, useState } from 'react'
import { getUser } from '../services/get-user.service'

export default function useGetUser() {
  const [currency, setCurrency] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataSaved, setDataSaved] = useState(false)

  async function fetchUserCurrency() {
    setLoading(true)
    const [error, result] = await getUser()
    setLoading(false)
    setCurrency(result)
  }

  useEffect(() => {
    fetchUserCurrency()
  }, [dataSaved])

  return { currency, loading, setDataSaved }
}
