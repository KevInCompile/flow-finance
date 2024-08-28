"use client";

import Head from "@/app/components/Head/Head";
import SkeletonTable from "@/app/loaders/SkeletonTable";
import OpenButton from "../accounts/OpenButton/OpenButton";
import useAccounts from "../accounts/hooks/useAccounts";
import BentoInformation from "./components/BentoInformation/BentoInformation";
import ModalNewExpense from "./components/ModalNewExpense";
import TableExpenses from "./components/TableExpenses/TableExpenses";
import useExpenses from "./hooks/useExpenses";
import { useEffect, useState } from "react";
import { monthNames } from "@/app/utils/months";
import BackIcon from "./assets/back";
import NextIcon from "./assets/nextIcon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ExpenseAgrupedModel } from "./models/ExpenseAgruped";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Resume() {
  const { data, loading, setRefresh } = useAccounts()
  const { expenses, loading: loadingExpenses, setRefresh: setRefreshExpenses } = useExpenses()
  const [mesActual, setMesActual] = useState(7)
  const [anioActual, setAnioActual] = useState(2024)

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

  return (
    <>
      <Head />
      <div>
        <section className="w-full md:w-[100%] px-10 mt-5">
          <h1 className='text-2xl font-medium text-start text-[var(--color-usage)] pb-2 animate-fade-in'>Resumen</h1>
          <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 mt-3 gap-5'>
            <BentoInformation data={data} loading={loading} expensesAgruped={gastosAgrupados} />
            <Card className="col-span-2 lg:col-span-1 bg-[#1F1D1D]">
              <CardHeader>
                <CardTitle className="text-secondary">Realizar Ingreso</CardTitle>
                <CardDescription>Ingresa dinero a tus cuentas o paga deudas</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monto">Monto</Label>
                    <Input id="monto" name="monto" type="number" placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cuenta">Cuenta</Label>
                    <Select name="cuenta" defaultValue="principal">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una cuenta o deuda"/>
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                        <SelectItem className='text-black' value="principal">Cuenta Principal</SelectItem>
                        <SelectItem className='text-black' value="ahorros">Ahorros</SelectItem>
                        <SelectItem className='text-black' value="inversiones">Inversiones</SelectItem>
                        <SelectItem className='text-black' value="deuda_hipoteca">Pagar Hipoteca</SelectItem>
                        <SelectItem className='text-black' value="deuda_automovilPrestamo">Pagar Préstamo Automóvil</SelectItem>
                        <SelectItem className='text-black' value="deuda_tarjetaCredito">Pagar Tarjeta de Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-white">
                    Realizar Ingreso
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          <div className="mt-28">
            <div className="grid grid-cols-2 items-center">
              <div className="flex gap-3 items-center">
                <h3 className="text-2xl text-[var(--color-usage)] font-medium">Registro de {monthName} - {anioActual }</h3>
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
                      <TableExpenses data={gastosAgrupados} refresh={refreshData} monthCurrent={mesActual} />
                    </TabsContent>
                  </Tabs>
                )
            }
          </div>
        </section>
        <ModalNewExpense refresh={refreshData} />
      </div>
    </>
  );
}
