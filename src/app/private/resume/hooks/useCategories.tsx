import { useEffect, useState } from 'react'
import CategoriesFetch from '../services/categories.service'
import { toast } from 'sonner'

interface categoriesModel {
  id: number
  name: string
}

export default function useCategories() {
  const [categories, setCategories] = useState<categoriesModel[]>([])

  useEffect(() => {
    const getData = async () => {
      const [error, result] = await CategoriesFetch()
      if (error) return toast(error)
      setCategories(result)
    }
    getData()
  }, [])

  return { categories }
}
