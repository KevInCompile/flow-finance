import { ExpenseModel } from "../hooks/useExpenses"

export interface ExpenseAgrupedModel {
  id: number
  value: number
  accountname: string
  categoryname: string
  date: string
  description: string
  username: string
  details?: ExpenseModel[]
}
