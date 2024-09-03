import { useState } from "react"
import SkeletonResume from "@/app/loaders/SkeletonResume"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ExpenseModel } from "../../hooks/useExpenses"
import useAccounts from "../../../accounts/hooks/useAccounts"
import useDebts from "../../../debts/hooks/useDebts"
import Link from "next/link"
import { TrendingDown, TrendingUp } from "lucide-react"
import { AccountModel } from "../../../accounts/models/account.model"

export default function BentoInformation ({expensesAgruped, crecimiento, accounts}: {expensesAgruped: ExpenseModel[], crecimiento: (account: string) => string, accounts: AccountModel[]}) {

  const [accountSelected, setAccountSelected] = useState('')
  const [debtSelected, setDebtSelected] = useState('')

  const {loading: loadingAccounts} = useAccounts()
  const {data:debts, loading: loadingDebts} = useDebts()

  const datosLinea = expensesAgruped.reduce((acc: any, gasto) => {
      const dia = parseInt(gasto.date.split("-")[2])
      if (acc[dia]) {
        acc[dia].value += gasto.value
      } else {
        acc[dia] = { dia, value: gasto.value }
      }
      return acc
    }, {})

  const datosLineaArray = Object.values(datosLinea).sort((a: any, b:any) => a.dia - b.dia)

  const baseUrl = window.location.pathname
  const newUrl = (route: string) => baseUrl.replace('resume', route)

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
                  accounts.length >= 1 && accountSelected === ''
                  ? '$ ' + accounts[0]?.value.toLocaleString()
                  : !accounts.length ? <Link href={newUrl('accounts')} className="text-purple-500 text-sm underline animate-pulse">Agregar cuentas</Link> : '$ ' + accounts?.filter((item) => item.name === accountSelected)[0]?.value?.toLocaleString()
                }
              </h2>
                <div className="flex items-center mt-2 text-sm">
                  {parseFloat(crecimiento(accounts.length >= 1 && accountSelected === '' ? accounts[0].name : accountSelected)) >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                  )}
                  <span className={parseFloat(crecimiento(accounts.length >= 1 && accountSelected === '' ? accounts[0].name : accountSelected)) >= 0 ? "text-green-500" : "text-red-500"}>
                    {crecimiento(accounts.length >= 1 && accountSelected === '' ? accounts[0].name : accountSelected)}% este mes
                  </span>
                </div>
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
                <LineChart data={datosLineaArray} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )
        }
      </div>
    </div>
  )
}
