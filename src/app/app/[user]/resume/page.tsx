'use client'

import { useEffect, useState } from 'react'
import Head from '@/app/components/Head/Head'
import SkeletonTable from '@/app/loaders/SkeletonTable'
import useAccounts from '../accounts/hooks/useAccounts'
import useExpenses from './hooks/useExpenses'
import { monthNames } from '@/app/utils/months'
import BackIcon from './assets/back'
import NextIcon from './assets/nextIcon'
import TableTransactions from './components/TableTransactions/TableTransactions'
import useIncomes from './hooks/useIncomes'
import { Button } from '@/components/ui/button'
import { CircleHelp, Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import Tour from './utils/steps-tour'
import { DataAgruped } from './models/ExpensesIncomesModel'

/**
 * Dynamically import BentoInformation component to improve initial load time
 */
const BentoInformation = dynamic(
  () => import('./components/BentoInformation/BentoInformation'),
  { ssr: false }
)

/**
 * Resume Component
 *
 * This component displays a financial summary for the user, including:
 * - Total balance for the current month
 * - List of transactions (expenses and incomes)
 * - Options to view transactions in aggregated or detailed format
 * - Month navigation
 *
 * It uses custom hooks for managing accounts, expenses, and incomes data,
 * and provides functionality to filter and display this data based on the selected month.
 */

export default function Resume() {
  const {
    data: accounts,
    loading: loadingAccounts,
    setData: setAccounts,
  } = useAccounts()
  const {
    expenses,
    loading: loadingExpenses,
    setExpenses,
    deleteExpense,
  } = useExpenses()
  const { data: incomes, deleteIncome, setData: setIncomes } = useIncomes()
  const [mesActual, setMesActual] = useState(0)
  const [anioActual, setAnioActual] = useState(2024)
  const [tour, setTour] = useState(false)
  const [isDataAgruped, setIsDataAgruped] = useState(false)

  const currentDate = new Date()
  const monthName = monthNames[mesActual]

  useEffect(() => {
    setMesActual(currentDate.getMonth())
  }, [])

  /**
   * Combines expenses and incomes into a single transactions array
   */
  const transactions = [...expenses, ...incomes]

  /**
   * Filters transactions for the current month and year, and sorts them by date
   */
  const transactionsFilterForDate = transactions
    .filter((gasto) => {
      if (!gasto.date) return false
      const [year, month] = gasto.date.split('-')
      return parseInt(year) === anioActual && parseInt(month) - 1 === mesActual
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  /**
   * Filters an array of transactions for the current month and year
   * @param {Array} array - The array of transactions to filter
   * @returns {Array} Filtered array of transactions
   */
  const filterForMonth = (array: any) => {
    return array?.filter((gasto: DataAgruped) => {
      const [year, month] = gasto.date.split('-')
      return parseInt(year) === anioActual && parseInt(month) - 1 === mesActual
    })
  }

  /**
   * Calculates the growth percentage for a given account
   * @param {string} cuenta - The account name
   * @returns {string} The growth percentage as a string
   */
  const calcularCrecimiento = (cuenta: string) => {
    const ingresosDelMes = filterForMonth(incomes)
      .filter((ingreso: DataAgruped) => ingreso.account === cuenta)
      .reduce((total: number, ingreso: DataAgruped) => total + ingreso.value, 0)
    const gastosDelMes = filterForMonth(expenses)
      .filter((gasto: DataAgruped) => gasto.accountname === cuenta)
      .reduce((total: number, gasto: DataAgruped) => total + gasto.value, 0)
    const crecimiento = ingresosDelMes - gastosDelMes
    const value = accounts.filter((acc) => acc.name === cuenta)[0]
    const porcentajeCrecimiento = (crecimiento / +value?.value) * 100
    if (!porcentajeCrecimiento) return '0'
    return porcentajeCrecimiento.toFixed(2)
  }

  /**
   * Changes the current month, updating the year if necessary
   * @param {string} direccion - The direction to change the month ("anterior" or "siguiente")
   */
  const cambiarMes = (direccion: string) => {
    setMesActual((prevMes) => {
      if (direccion === 'anterior') {
        return prevMes === 0 ? 11 : prevMes - 1
      } else {
        return prevMes === 11 ? 0 : prevMes + 1
      }
    })
    if (mesActual === 0 && direccion === 'anterior') {
      setAnioActual((prevAnio) => prevAnio - 1)
    } else if (mesActual === 11 && direccion === 'siguiente') {
      setAnioActual((prevAnio) => prevAnio + 1)
    }
  }

  /**
   * Handles the change of aggregated data view
   * @param {Event} e - The event object from the checkbox
   */
  const handleAgruped = (e: any) => {
    const value = e.target.checked
    window.localStorage.setItem('isAgruped', value)
    setIsDataAgruped(value)
  }

  /**
   * Sets the initial aggregated data view state from localStorage
   */
  useEffect(() => {
    const local = window.localStorage.getItem('isAgruped') as string
    if (local === 'true') return setIsDataAgruped(true)
    return setIsDataAgruped(false)
  }, [])

  return (
    <>
      <Head />
      <section className="w-full md:w-[100%] px-5 mt-5 md:px-10">
        <div className="grid grid-cols-2 items-center">
          <h1 className="text-md md:text-2xl font-semibold text-start text-purple-300 pb-2 animate-fade-in flex items-center">
            Total Balance of {monthName}
            <Button className="text-white" onClick={() => setTour(true)}>
              <CircleHelp />
            </Button>
          </h1>
          <div className="text-end">
            <button
              className="border-gray-300 border rounded-md mr-3 hover:bg-[var(--color-usage)] transition-colors"
              title="Mes anterior"
              onClick={() => cambiarMes('anterior')}
            >
              <BackIcon />
            </button>
            <button
              className="border-gray-300 border rounded-md hover:bg-[var(--color-usage)] transition-colors"
              title="Mes siguiente"
              onClick={() => cambiarMes('siguiente')}
            >
              <NextIcon />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-14">
          <BentoInformation
            expenses={transactionsFilterForDate}
            crecimiento={calcularCrecimiento}
            accounts={accounts}
            incomes={incomes}
            setIncomes={setIncomes}
            setAccounts={setAccounts}
            loadingAccounts={loadingAccounts}
            setExpenses={setExpenses}
          />
          <div className="border rounded-lg border-gray-500 bg-[#1F1D1D]">
            <div className="flex flex-row gap-5 justify-between p-4">
              <div>
                <div className="flex flex-row gap-3 items-center">
                  <h1 className="text-purple-400">Transactions agruped</h1>
                  <label className="switch" title="Agruped">
                    <input
                      type="checkbox"
                      id="toggle-switch"
                      onChange={handleAgruped}
                      checked={isDataAgruped}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <small>You can view details your tansactions story</small>
              </div>
              <div className="flex gap-3 items-center">
                <button className="border-[1px] rounded-xl border-gray-700 p-2 h-10 w-10">
                  <Search />
                </button>
              </div>
            </div>
            {loadingExpenses ? (
              <SkeletonTable />
            ) : (
              <TableTransactions
                data={transactionsFilterForDate}
                monthCurrent={mesActual}
                isAgruped={isDataAgruped}
                deleteIncome={deleteIncome}
                setAccounts={setAccounts}
                accounts={accounts}
                deleteExpense={deleteExpense}
              />
            )}
          </div>
        </div>
      </section>
      <Tour runTour={tour} />
    </>
  )
}
