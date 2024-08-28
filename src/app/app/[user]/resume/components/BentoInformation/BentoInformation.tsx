import SkeletonResume from "@/app/loaders/SkeletonResume"
import { AccountModel } from "../../../accounts/models/account.model"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useState } from "react"
import { ExpenseModel } from "../../hooks/useExpenses"


export default function BentoInformation ({data, loading, expensesAgruped}: {data: AccountModel[], loading: boolean, expensesAgruped: ExpenseModel[]}) {

  const accountMain = data?.filter((item) => item.type === "principal")[0]
  const accountInversion = data?.filter((item) => item.type === "inversion")[0]
  const accountSaving = data?.filter((item) => item.type === "ahorros")[0]
  const proxDebt = data?.filter((item) => item.type === "deuda")[0]


  const datosTorta = expensesAgruped.map(gasto => ({
    name: gasto.categoryname,
    value: gasto.value
  }))

  const COLORS = ['#66BFFF', '#66D6C2', '#FFD68A', '#FFB38A', '#B3AFE6', '#B3DEC0']


  return (
    <div className='grid grid-cols-2 min-h-[290px]'>
      <div className="py-4 px-5 flex flex-col gap-3 bg-gradient-to-r from-purple-200 to-purple-300 items-start rounded-tl-md">
        {
          loading ? <SkeletonResume />
          : (
            <>
            <span className="text-purple-500 font-medium">{accountMain ? accountMain?.name : 'Sin cuenta principal'}</span>
              <h2 className="text-md md:text-xl text-black">
                { accountMain ? '$ ' + accountMain?.value?.toLocaleString() : <small>Sin registros</small>}
              </h2>
              <small className="bg-palette px-3 py-1 rounded-full text-black">+0 %</small>
            </>
          )
        }
      </div>
      <div className="py-4 px-5 flex flex-col gap-3 items-start text-white bg-[#1F1D1D] rounded-tr-md border-b border-r border-t">
        {
          loading ? <SkeletonResume /> : (
            <>
             <span>Ahorros</span>
              { accountSaving ? <h2 className="text-md md:text-xl">$ {accountSaving?.value?.toLocaleString()}</h2> : <small>Sin registros</small>}
              <small className="bg-[var(--color-usage)] text-black px-3 py-1 rounded-full">+0 %</small>
            </>
          )
        }
      </div>
      <div className="py-4 px-5 flex flex-col gap-3 items-start  text-white bg-[#1F1D1D] rounded-br-md rounded-bl-md border-l border-b border-r col-span-2 ">
        {
          loading ? <SkeletonResume /> :
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
