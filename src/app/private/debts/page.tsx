'use client'

import Head from '@/app/components/Head/Head'
import OpenButton from '../accounts/OpenButton/OpenButton'
import ModalNewDebt from './Modal/ModalNewDebt'
import useDebts from './hooks/useDebts'
import CardDebt from './components/card/CardDebt'
import Gift from '@/../public/empty.gif'
import Image from 'next/image'
import LoaderPage from '@/app/components/LoaderPage/LoaderPage'
import { PiggyBank, TrendingUp, Calendar, DollarSign, Percent, Clock } from 'lucide-react'

export default function Debts() {
  const { data, loading, setData, actionDelete } = useDebts()

  // Calcular resumen de deudas
  const totalDeudas = data?.reduce((sum, debt) => sum + (debt.total_amount || 0), 0) || 0
  const totalInteresAcumulado = data?.reduce((sum, debt) => sum + (debt.accumulated_interest || 0), 0) || 0
  const totalConInteres = data?.reduce((sum, debt) => sum + (debt.total_with_interest || debt.total_amount || 0), 0) || 0
  const deudasActivas = data?.length || 0

  return (
    <>
      <Head />

      {/* Header con estadísticas tipo banco */}
      <div className="px-5 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Mis Deudas</h1>
            <p className="text-gray-400 text-sm">Gestión y seguimiento de obligaciones financieras</p>
          </div>
          <OpenButton />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoaderPage />
            <p className="text-gray-400 mt-4">Cargando deudas...</p>
          </div>
        ) : data?.length === 0 || data?.length === undefined ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative w-64 h-64 mb-6">
              <Image
                src={Gift}
                alt="Sin deudas"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No tienes deudas registradas</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Comienza agregando tu primera deuda para llevar un control detallado de tus obligaciones financieras.
            </p>
            <OpenButton />
          </div>
        ) : (
          <>
            {/* Grid de deudas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {data?.map((item) => (
                <div key={item.id}>
                  <CardDebt
                    deleteDebt={() => actionDelete(item.id)}
                    fullData={data}
                    data={item}
                    setData={setData}
                  />
                </div>
              ))}
            </div>

            {/* Resumen al final */}
            {data?.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-gray-400 text-sm">Resumen total</p>
                    <p className="text-white font-medium">
                      {deudasActivas} deuda{deudasActivas !== 1 ? 's' : ''} • ${totalConInteres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-green-400 text-sm">Capital</p>
                      <p className="text-white font-medium">${totalDeudas.toLocaleString()}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-700"></div>
                    <div className="text-center">
                      <p className="text-yellow-400 text-sm">Interés</p>
                      <p className="text-white font-medium">${totalInteresAcumulado.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ModalNewDebt />
    </>
  )
}
