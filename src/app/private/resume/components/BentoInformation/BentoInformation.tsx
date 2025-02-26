import { SetStateAction, useState } from 'react'
import SkeletonResume from '@/app/loaders/SkeletonResume'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import { AccountModel } from '../../../accounts/models/account.model'
import { formatCurrency } from '../../utils/formatPrice'
import { DataAgruped } from '../../models/ExpensesIncomesModel'
import { ExpenseModel } from '../../hooks/useExpenses'
// ICONS
import ModalExchange from '../Modals/ModalExchange'
import VisualizerSavingGoals from '../../../saving-goals/components/visualizer-resume'
import DialogNewExpense from '../Modals/ModalNewExpense'


interface Props {
  expenses: any
  accounts: AccountModel[]
  loadingAccounts: boolean
  setIncomes: any
  setAccounts: React.Dispatch<SetStateAction<AccountModel[]>>
  setExpenses: React.Dispatch<SetStateAction<ExpenseModel[]>>
}

export default function BentoInformation(props: Props) {
  // Destructured props
  const { expenses, accounts, loadingAccounts, setIncomes, setAccounts, setExpenses } = props

  // State
  const [accountSelected, setAccountSelected] = useState('')

  const combinedLineData = expenses.reduce((acc: any, expense: DataAgruped) => {
    const day = parseInt(expense.date.split('-')[2])
    const isIncome = expense.typeincome
    const key = isIncome ? 'valueincome' : 'value'

    if (!acc[day]) {
      acc[day] = { day }
    }

    acc[day][key] = (acc[day][key] || 0) + Number(expense.value)
    return acc
  }, {})

  const datosLineaArray = Object.values(combinedLineData)

  const baseUrl = window.location.pathname
  const newUrl = (route: string) => baseUrl.replace('profile', route)

  return (
    <div>
      <div className="flex flex-col gap-3 items-start rounded-xl saldo-total bg-[#191919] shadow-lg">
        {loadingAccounts ? (
          <SkeletonResume />
        ) : (
          <>
            <small className="px-6 pt-6">Puedes ver todas tus cuentas</small>
            <select
              className="text-purple-400 bg-transparent outline-none px-6"
              value={accountSelected}
              onChange={(e) => setAccountSelected(e.target.value)}
            >
              {!accounts.length ? <option>No tienes cuentas</option> : <></>}
              {accounts?.map((account) => {
                return (
                  <option key={account.id} value={account.name} className="text-black">
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
                  <Link href={newUrl('accounts')} className="text-white text-sm underline animate-pulse">
                    Crear cuenta
                  </Link>
                ) : (
                    formatCurrency(parseFloat(accounts?.filter((item) => item.name === accountSelected)[0]?.value))
                )}
              </h2>
            </div>
          </>
        )}
        <div className="grid grid-cols-3 w-full border-t border-zinc-800">
          <DialogNewExpense
            accounts={accounts}
            setIncomes={setIncomes}
            typeAction="expense"
            setAccounts={setAccounts}
            setExpenses={setExpenses}
          />
          <DialogNewExpense
            accounts={accounts}
            setIncomes={setIncomes}
            typeAction="income"
            setAccounts={setAccounts}
            setExpenses={setExpenses}
          />
          <ModalExchange accounts={accounts} setAccounts={setAccounts} />
        </div>
      </div>
      {datosLineaArray.length >= 1 && (
        <>
          <h3 className="py-6 text-purple-500 font-semibold text-md md:text-2xl">Grafico de gastos</h3>
          <div className="pt-4 px-5 flex flex-col gap-3 items-center text-white rounded-xl bg-[#191919] shadow-lg grafico">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={datosLineaArray} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#f87171" activeDot={{ r: 8 }} connectNulls={true} />
                <Line type="monotone" dataKey="valueincome" stroke="#4ade80" connectNulls={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <VisualizerSavingGoals />
        </>
      )}

    </div>
  )
}
