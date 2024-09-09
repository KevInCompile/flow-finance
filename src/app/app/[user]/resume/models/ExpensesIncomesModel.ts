import { IncomeModel } from "../components/TableIncomes/hooks/useIncomes";
import { ExpenseModel } from "../hooks/useExpenses";

export interface DataAgruped extends ExpenseModel, IncomeModel {}
