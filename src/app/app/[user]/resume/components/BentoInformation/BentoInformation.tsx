import SkeletonResume from "@/app/loaders/SkeletonResume"
import { AccountModel } from "../../../accounts/models/account.model"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useState } from "react"
import { ExpenseModel } from "../../hooks/useExpenses"
import useAccounts from "../../../accounts/hooks/useAccounts"
import useDebts from "../../../debts/hooks/useDebts"
import Link from "next/link"


export default function BentoInformation ({expensesAgruped}: {expensesAgruped: ExpenseModel[]}) {

  const [accountSelected, setAccountSelected] = useState('')
  const [debtSelected, setDebtSelected] = useState('')

  const {data:accounts, loading: loadingAccounts} = useAccounts()
  const {data:debts, loading: loadingDebts} = useDebts()

  const datosTorta = expensesAgruped.map(gasto => ({
    name: gasto.categoryname,
    value: gasto.value
  }))

  const baseUrl = window.location.pathname
  const newUrl = (route: string) => baseUrl.replace('resume', route)

  const COLORS = ['#66BFFF', '#66D6C2', '#FFD68A', '#FFB38A', '#B3AFE6', '#B3DEC0']

  return (
    <div className='grid grid-cols-2 min-h-[290px]'>
      <div className="py-4 px-5 flex flex-col gap-3 bg-gradient-to-r from-purple-200 to-purple-300 items-start rounded-tl-md">
        {
          loadingAccounts ? <SkeletonResume />
          : (
            <>
            <select className="text-purple-500 font-medium bg-transparent outline-none" value={accountSelected} onChange={(e) => setAccountSelected(e.target.value)}>
              {!accounts.length ? <option>No tienes cuentas 🥴</option> : <></>}
              {
                accounts?.map((account) => {
                  return (
                    <option key={account.id} value={account.name} className='text-black'>{account.name}</option>
                  )
                })
              }
            </select>
              <h2 className="text-md md:text-xl text-black">
                {
                  accounts.length >= 1 && debtSelected === ''
                  ? '$ ' + accounts[0]?.value.toLocaleString()
                  : !accounts.length ? <Link href={newUrl('accounts')} className="text-purple-500 text-sm underline animate-pulse">Agregar cuentas</Link> : '$ ' + accounts?.filter((item) => item.name === accountSelected)[0]?.value?.toLocaleString()
                }
              </h2>
              <small className="bg-palette px-3 py-1 rounded-full text-black">+0 %</small>
            </>
          )
        }
      </div>
      <div className="py-4 px-5 flex flex-col gap-3 items-start text-white bg-[#1F1D1D] rounded-tr-md border-b border-r border-t">
        {
          loadingDebts ? <SkeletonResume /> :
            <>
              <select className="font-medium bg-transparent outline-none" value={debtSelected} onChange={(e) => setDebtSelected(e.target.value)}>
                {!debts.length ? <option>No tienes deudas 😌</option> : <></>}
                {
                  debts?.map((debt) => {
                    return (
                      <option key={debt.id} value={debt.description} className='text-black'>{debt.description}</option>
                    )
                  })
                }
                {debtSelected ?? 'Sin deudas'}
              </select>
                <h2 className="text-md md:text-xl">
                  {
                    debts.length >= 1 && debtSelected === ''
                    ? '$ ' + debts[0]?.totaldue.toLocaleString()
                    : !debts.length ? <Link href={newUrl('debts')} className="text-palette text-sm underline animate-pulse">Agregar deudas</Link> : '$ ' + debts?.filter((item) => item.description === debtSelected)[0]?.totaldue?.toLocaleString()
                  }
                </h2>
            </>
        }
      </div>
      <div className="py-4 px-5 flex flex-col gap-3 items-start  text-white bg-[#1F1D1D] rounded-br-md rounded-bl-md border-l border-b border-r col-span-2 ">
        {
          (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={datosTorta}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {datosTorta.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </>
          )
        }
      </div>
    </div>
  )
}
