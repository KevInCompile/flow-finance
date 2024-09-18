import { SetStateAction, useState } from 'react'
import SkeletonResume from '@/app/loaders/SkeletonResume'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Link from 'next/link'
import { AccountModel } from '../../../accounts/models/account.model'
import { formatCurrency } from '../../utils/formatPrice'
import { DataAgruped } from '../../models/ExpensesIncomesModel'
import useModal from '@/app/components/Modal/useModal'
import { IncomeModel } from '../../models/IncomeModel'
import ModalNewExpense from '../Modals/ModalNewExpense'
import { ExpenseModel } from '../../hooks/useExpenses'
// ICONS
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import ModalExchange from '../Modals/ModalExchange'
import VisualizerSavingGoals from '../../../saving-goals/components/visualizer-resume'

export default function BentoInformation({
  expenses,
  accounts,
  setIncomes,
  loadingAccounts,
  setAccounts,
  setExpenses,
}: {
  expenses: any
  accounts: AccountModel[]
  loadingAccounts: boolean
  incomes: IncomeModel[]
  setIncomes: any
  setAccounts: React.Dispatch<SetStateAction<AccountModel[]>>
  setExpenses: React.Dispatch<SetStateAction<ExpenseModel[]>>
}) {
  const [accountSelected, setAccountSelected] = useState('')
  const [typeAction, setTypeAction] = useState('')
  const { handleShowModal } = useModal()

  const lineData = expenses
    .filter((item: any) => item.type === 'expense')
    .reduce((acc: any, expense: DataAgruped) => {
      const day = parseInt(expense.date.split('-')[2])
      if (acc[day]) {
        acc[day].value += Number(expense.value)
      } else {
        acc[day] = { day, value: Number(expense.value) }
      }
      return acc
    }, {})

  const datosLineaArray = Object.values(lineData).sort(
    (a: any, b: any) => a.day - b.day
  )

  const baseUrl = window.location.pathname
  const newUrl = (route: string) => baseUrl.replace('profile', route)

  const handleChangeTypeAction = (action: string) => {
    setTypeAction(action)
    handleShowModal()
  }

  return (
    <div>
      <div className="flex flex-col gap-3 items-start rounded-xl saldo-total bg-[#1F1D1D] border border-gray-500">
        {loadingAccounts ? (
          <SkeletonResume />
        ) : (
          <>
            <small className="px-6 pt-6">
              You can view your account details
            </small>
            <select
              className="text-purple-400 bg-transparent outline-none px-6"
              value={accountSelected}
              onChange={(e) => setAccountSelected(e.target.value)}
            >
              {!accounts.length ? (
                <option>You don&apos;t have any accounts</option>
              ) : (
                <></>
              )}
              {accounts?.map((account) => {
                return (
                  <option
                    key={account.id}
                    value={account.name}
                    className="text-black"
                  >
                    {account.name}
                  </option>
                )
              })}
            </select>
            <div className="flex flex-wrap items-center pb-4">
              <h2 className="text-2xl md:text-3xl text-primary px-6">
                {accounts.length >= 1 && accountSelected === '' ? (
                  formatCurrency(parseFloat(accounts[0].value))
                ) : !accounts.length ? (
                  <Link
                    href={newUrl('accounts')}
                    className="text-white text-sm underline animate-pulse"
                  >
                    Add account
                  </Link>
                ) : (
                  formatCurrency(
                    parseFloat(
                      accounts?.filter(
                        (item) => item.name === accountSelected
                      )[0]?.value
                    )
                  )
                )}
              </h2>
            </div>
          </>
        )}
        <div className="grid grid-cols-3 w-full border-t border-gray-500">
          <button
            onClick={() => handleChangeTypeAction('expense')}
            className={`flex items-center gap-1 text-primary justify-center p-4 border-r border-gray-600 rounded-bl-lg hover:bg-purple-600 ${accounts.length < 1 ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={accounts.length < 1}
          >
            <ArrowUpRight className="text-purple-400" />
            <span className="text-sm">Expense</span>
          </button>
          <button
            onClick={() => handleChangeTypeAction('income')}
            className={`flex items-center gap-1 text-primary justify-center p-4 border-r border-gray-600 hover:bg-purple-600 ${accounts.length < 1 ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={accounts.length < 1}
          >
            <ArrowDownLeft className="text-purple-400" />
            <span className="text-sm">Request</span>
          </button>
          <ModalExchange accounts={accounts} setAccounts={setAccounts} />
        </div>
      </div>
      {datosLineaArray.length >= 1 && (
        <>
          <h3 className="py-6 text-purple-600 font-semibold text-md md:text-2xl">
            Statistics of expenses
          </h3>
          <div className="pt-4 px-5 flex flex-col gap-3 items-center text-white bg-[#1F1D1D] rounded-xl border border-gray-500 grafico">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={datosLineaArray}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#c084fc"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <VisualizerSavingGoals />
        </>
      )}
      <ModalNewExpense
        accounts={accounts}
        setIncomes={setIncomes}
        typeAction={typeAction}
        setAccounts={setAccounts}
        setExpenses={setExpenses}
      />
    </div>
  )
}
