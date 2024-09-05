"use client";

import { useEffect, useState } from "react";
import Head from "@/app/components/Head/Head";
import SkeletonTable from "@/app/loaders/SkeletonTable";
import OpenButton from "../accounts/OpenButton/OpenButton";
import useAccounts from "../accounts/hooks/useAccounts";
import ModalNewExpense from "./components/ModalNewExpense";
import TableExpenses from "./components/TableExpenses/TableExpenses";
import useExpenses from "./hooks/useExpenses";
import { monthNames } from "@/app/utils/months";
import BackIcon from "./assets/back";
import NextIcon from "./assets/nextIcon";
import { ExpenseAgrupedModel } from "./models/ExpenseAgruped";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableIncomes from "./components/TableIncomes/TableIncomes";
import useIncomes from "./components/TableIncomes/hooks/useIncomes";
import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";
import dynamic from "next/dynamic";
import Tour from "./utils/steps-tour";

const BentoInformation = dynamic(() => import( "./components/BentoInformation/BentoInformation"), {ssr: false})


export default function Resume() {
  const { data: accounts, loading: loadingAccounts, setRefresh } = useAccounts()
  const { expenses, loading: loadingExpenses, setRefresh: setRefreshExpenses } = useExpenses()
  const {data: incomes, deleteIncome, setData: setIncomes} = useIncomes()
  const [mesActual, setMesActual] = useState(0)
  const [anioActual, setAnioActual] = useState(2024)
  const [tour, setTour] = useState(false)

  const currentDate = new Date()
  const monthName = monthNames[mesActual]

  useEffect(() => {
    setMesActual(currentDate.getMonth())
  }, [])

  const refreshData = () => {
    setRefresh(true)
    setRefreshExpenses(true)
  }

  const gastosFiltrados = expenses.filter(gasto => {
    let [año, mesA, día] = gasto.date.split('T')[0].split('-');
    mesA = mesA.startsWith('0') ? mesA.slice(1) : mesA;
    const fechaConvertida = `${año}-${mesA}-${día}`;
    const [anio, mes] = fechaConvertida.split("-")
    return parseInt(anio) === anioActual && parseInt(mes) - 1 === mesActual
  })

  const gastosAgrupados = gastosFiltrados.reduce((acc: ExpenseAgrupedModel[], gasto) => {
    const gastoExistente = acc.find(g => g.categoryname === gasto.categoryname)
    if (gastoExistente) {
      gastoExistente.value += gasto.value
      gastoExistente.details?.push(gasto)
    } else {
      acc.push({ ...gasto, details: [gasto] })
    }
    return acc
  }, [])

  const ingresosFiltrados = incomes.filter(ingreso => {
    const [anio, mes] = ingreso.date.split("-")
    return parseInt(anio) === anioActual && parseInt(mes) - 1 === mesActual
  })

  const calcularCrecimiento = (cuenta: string) => {
    const ingresosDelMes = ingresosFiltrados.filter(ingreso => ingreso.account === cuenta)
      .reduce((total, ingreso) => total + ingreso.value, 0)
    const gastosDelMes = gastosFiltrados.filter(gasto => gasto.accountname === cuenta)
      .reduce((total, gasto) => total + gasto.value, 0)
    const crecimiento = ingresosDelMes - gastosDelMes
    const value = accounts.filter(acc => acc.name === cuenta)[0]
    const porcentajeCrecimiento = (crecimiento / +value?.value) * 100
    if (!porcentajeCrecimiento) return '0'
    return porcentajeCrecimiento.toFixed(2)
  }

  const cambiarMes = (direccion: string) => {
    setMesActual(prevMes => {
      if (direccion === "anterior") {
        return prevMes === 0 ? 11 : prevMes - 1
      } else {
        return prevMes === 11 ? 0 : prevMes + 1
      }
    })
    if (mesActual === 0 && direccion === "anterior") {
      setAnioActual(prevAnio => prevAnio - 1)
    } else if (mesActual === 11 && direccion === "siguiente") {
      setAnioActual(prevAnio => prevAnio + 1)
    }
  }

  const obtenerConsejoFinanciero = () => {
    const totalGastos = gastosFiltrados.reduce((total, gasto) => total + gasto.value, 0)
    const totalIngresos = ingresosFiltrados.reduce((total, ingreso) => total + ingreso.value, 0)
    const porcentajeGastos = (totalGastos / totalIngresos) * 100

    if (porcentajeGastos > 80) {
      return "Estás gastando más del 80% de tus ingresos. Considera reducir gastos no esenciales."
    } else if (porcentajeGastos > 50) {
      return "Tu nivel de gastos es moderado. Intenta aumentar tus ahorros si es posible."
    } else {
      return "¡Buen trabajo! Estás manteniendo tus gastos bajo control. Considera invertir el excedente."
    }
  }


  return (
    <>
      <Tour runTour={tour}  />
      <Head />
      <div>
        <section className="w-full md:w-[100%] px-5 mt-5 md:px-10">
          <h1 className='text-2xl font-medium text-start text-[var(--color-usage)] pb-2 animate-fade-in flex items-center'>
            Resumen
            <Button className="text-white" onClick={() => setTour(true)}><CircleHelp /></Button>
          </h1>
          <div className='grid grid-cols-1 lg:grid-cols-2 mt-3 gap-5'>
            <BentoInformation
              expenses={gastosFiltrados}
              crecimiento={calcularCrecimiento}
              accounts={accounts}
              loadingAccounts={loadingAccounts}
            />
          </div>
          <div className="mt-5">
            {
              expenses.length > 1 && <small className="italic opacity-70">{obtenerConsejoFinanciero()}</small>
            }
            <div className="grid grid-cols-2 items-center mt-4">
              <div className="flex gap-3 items-center">
                <h3 className="text-md md:text-2xl text-[var(--color-usage)] font-medium">{monthName} - {anioActual }</h3>
                <OpenButton />
              </div>
              <div className="text-end">
                <button className="border-gray-300 border rounded-md mr-3 hover:bg-[var(--color-usage)] transition-colors" title='Mes anterior' onClick={() => cambiarMes("anterior")}>
                  <BackIcon />
                </button>
                  <button className="border-gray-300 border rounded-md hover:bg-[var(--color-usage)] transition-colors" title='Mes siguiente' onClick={() => cambiarMes("siguiente")}>
                  <NextIcon />
                </button>
              </div>
            </div>

            {
              loadingExpenses ? <SkeletonTable />
              : (
                  <Tabs defaultValue="gastos">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-500">
                      <TabsTrigger value="gastos">Gastos</TabsTrigger>
                      <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="gastos">
                      <TableExpenses
                        data={gastosAgrupados}
                        monthCurrent={mesActual}
                        refresh={refreshData}
                       />
                    </TabsContent>
                    <TabsContent value='ingresos'>
                      <TableIncomes
                        monthCurrent={mesActual}
                        yearCurrent={anioActual}
                        incomes={incomes}
                        deleteIncome={deleteIncome} />
                    </TabsContent>
                  </Tabs>
                )
            }
          </div>
        </section>
        <ModalNewExpense refresh={refreshData} accounts={accounts} setIncomes={setIncomes} incomes={incomes} />
      </div>
    </>
  );
}
