import { SetStateAction } from 'react'
import { Debt } from '../../../models/debts.models'

export interface PropsCardDebt {
  data: Debt
  setData: React.Dispatch<SetStateAction<Debt[]>>
  fullData: Debt[]
  deleteDebt: () => void
}
