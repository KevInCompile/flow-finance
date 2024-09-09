import { ExpenseModel } from '../hooks/useExpenses'
import { IncomeModel } from './IncomeModel'

export interface DataAgruped extends ExpenseModel, IncomeModel {}
