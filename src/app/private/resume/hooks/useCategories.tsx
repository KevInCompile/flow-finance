import { useEffect, useState } from 'react'
import CategoriesFetch from '../services/categories.service'
import { toast } from 'sonner'
import { QueryResultRow } from '@vercel/postgres'

export interface Category {
  id: number
  name: string
  color: string
}

export default function useCategories() {
  const [categories, setCategories] = useState<Category[] | QueryResultRow[]>([])
  const [loading, setLoading] = useState(true)

  const getData = async () => {
    const [error, result] = await CategoriesFetch()
    if (error) return toast(error)
    setCategories(result)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return { categories, loading, setCategories }
}
