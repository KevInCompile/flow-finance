import { useState } from 'react'
import FormAbono from './FormPayment/FormPayment'
import DeleteConfirmation from '@/app/components/DeleteConfirmation/DeleteConfirmation'
import axios from 'axios'
import { toast } from 'sonner'
import { PropsCardDebt } from './models/card-debt.model'
import { formatCurrency } from '@/app/private/resume/utils/formatPrice'
import { FormatDate } from '@/app/utils/FormatDate'
import { PiggyBank, CircleX, Calendar, TrendingUp, DollarSign, Percent, ChevronDown, ChevronUp, CreditCard, Clock } from 'lucide-react'

export default function CardDebt(props: PropsCardDebt) {
  const { data, setData, fullData, deleteDebt } = props
  const { description, total_amount, pay_date, start_date, installments, id, payments, interest = 0, accumulated_interest = 0, total_with_interest = 0, monthly_payment = 0, total_interest = 0, amortization_table = [] } = data

  const [isPay, setIsPay] = useState(false)
  const [showAmortization, setShowAmortization] = useState(false)

  // Debug: check accumulated_interest value
  console.log('CardDebt Debug - accumulated_interest:', {
    raw: accumulated_interest,
    type: typeof accumulated_interest,
    isNaN: isNaN(accumulated_interest),
    parsed: parseFloat(accumulated_interest),
    isNaNParsed: isNaN(parseFloat(accumulated_interest))
  })

  // Helper function to safely convert to number
  const safeNumber = (value: any): number => {
    if (value === null || value === undefined) return 0
    if (typeof value === 'number') {
      return isNaN(value) || !isFinite(value) ? 0 : value
    }
    if (typeof value === 'string') {
      const num = parseFloat(value)
      return isNaN(num) || !isFinite(num) ? 0 : num
    }
    return 0
  }

  // Use safe values for calculations
  const safeAccumulatedInterest = safeNumber(accumulated_interest)
  const safeTotalWithInterest = safeNumber(total_with_interest)
  const safeTotalAmount = safeNumber(total_amount)

  const deletePayment = async (idPayment: number) => {
    try {
      const call = await axios.delete(`/api/payments?id=${idPayment}`)
      const { data } = call
      if (data.message) {
        toast.success('Abono eliminado!')
      }
    } catch (e: any) {
      toast.error(e)
    }
    return true
  }

  const handleDelete = async (id: number, idDebt: number, value: number) => {
    const isDelete = await deletePayment(id)
    if (isDelete) {
      const filter = {
        ...data,
        totalamount: data.total_amount + value,
        payments: data.payments.filter((item) => item.id !== id),
      }
      setData([...fullData.filter((item) => item.id !== idDebt), filter])
    }
  }


  const totalAmountPayments = payments.reduce((sum, debt: any) => {
    const payValue = parseFloat(debt.pay_value) || 0
    return sum + (isNaN(payValue) ? 0 : payValue)
  }, 0)
  const totalWithInterest = safeTotalWithInterest > 0 ? safeTotalWithInterest : (safeTotalAmount + safeAccumulatedInterest)
  const remainingWithInterest = totalWithInterest - totalAmountPayments
  const monthlyPaymentWithInterest = monthly_payment > 0 ? monthly_payment : (safeTotalAmount / installments)

   // Calcular cuotas vencidas con lógica mejorada
   const calculateDueInstallments = () => {
     const startDate = new Date(start_date)
     const currentDate = new Date()
     const payDay = parseInt(pay_date) || 1

     let dueInstallments = 0
     let nextPaymentDate = new Date(startDate)

     // Ajustar primer día de pago
     const startDay = startDate.getDate()
     if (startDay !== payDay) {
       nextPaymentDate.setDate(payDay)
       if (nextPaymentDate <= startDate) {
         nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
         nextPaymentDate.setDate(payDay)
       }
     }

     // Contar cuántas fechas de pago han pasado hasta la fecha actual
     while (nextPaymentDate <= currentDate && dueInstallments < installments) {
       dueInstallments++

       // Calcular próximo día de pago
       nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)

       // Ajustar día de pago si el mes no tiene ese día (ej: 31 en febrero)
       const daysInMonth = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 0).getDate()
       if (payDay > daysInMonth) {
         nextPaymentDate.setDate(daysInMonth)
       } else {
         nextPaymentDate.setDate(payDay)
       }
     }

     return { dueInstallments, nextPaymentDate }
   }

   const { dueInstallments, nextPaymentDate: nextPaymentCalc } = calculateDueInstallments()
   const paidInstallments = Math.min(payments.length, dueInstallments)
   const pendingInstallments = Math.max(0, dueInstallments - paidInstallments)

   // Calcular próxima fecha de pago corregida
   const calculateNextPaymentDate = () => {
     if (dueInstallments >= installments) {
       return "Deuda completada"
     }

     const today = new Date()
     const payDay = parseInt(pay_date) || 1

     // Si ya pasó el día de pago de este mes, mostrar próximo mes
     if (today.getDate() >= payDay) {
       // Próximo pago es el próximo mes
       const nextDate = new Date(today)
       nextDate.setMonth(nextDate.getMonth() + 1)
       nextDate.setDate(payDay)

       // Ajustar si el mes no tiene ese día
       const daysInMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()
       const adjustedPayDay = Math.min(payDay, daysInMonth)
       nextDate.setDate(adjustedPayDay)

       return FormatDate(nextDate.toISOString().split('T')[0])
     } else {
       // Aún no pasa el día de pago este mes
       const nextDate = new Date(today)
       nextDate.setDate(payDay)
       return FormatDate(nextDate.toISOString().split('T')[0])
     }
   }

   const nextPaymentDate = calculateNextPaymentDate()
  return (
    <div className="bg-gradient-to-br from-[#242424] to-gray-900 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600">
      {/* Header de la tarjeta */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-[#242424]/20 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-400" />
              </div>
              <h1 className="text-lg font-bold text-white truncate">{description}</h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {FormatDate(start_date)}
              </span>
              <span className="flex items-center gap-1">
                <Percent className="h-3 w-3" />
                {interest}% anual
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-lg transition-all ${isPay ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
              onClick={() => setIsPay(!isPay)}
              title={isPay ? 'Cerrar pago' : 'Registrar pago'}
            >
              {isPay ? <CircleX className="h-4 w-4" /> : <PiggyBank className="h-4 w-4" />}
            </button>
            <button
              className={`p-2 rounded-lg transition-all ${showAmortization ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-400'}`}
              onClick={() => setShowAmortization(!showAmortization)}
              title="Ver tabla de amortización"
            >
              {showAmortization ? <ChevronUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            </button>
            <div className="p-2 rounded-lg bg-gray-700 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all">
              <DeleteConfirmation
                deleteItem={deleteDebt}
                message="¿Está seguro de eliminar esta deuda?"
              />
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Capital inicial</p>
              <p className="text-xl font-bold text-white">{formatCurrency(total_amount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Cuota mensual</p>
              <p className="text-lg font-semibold text-green-400">{formatCurrency(monthlyPaymentWithInterest)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Próximo pago</p>
              <p className="text-sm font-medium text-white flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {nextPaymentDate}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Saldo con interés</p>
              <p className="text-xl font-bold text-white">{formatCurrency(remainingWithInterest)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Interés acumulado</p>
              <p className="text-lg font-semibold text-yellow-400">{formatCurrency(safeAccumulatedInterest)}</p>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Pagado: {formatCurrency(totalAmountPayments)}</span>
            <span>Saldo: {formatCurrency(remainingWithInterest)}</span>
            <span>Total: {formatCurrency(totalWithInterest)}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalAmountPayments / totalWithInterest) * 100)}%` }}
            />
          </div>
        </div>
      </div>
      {/* Contenido expandible */}
      {isPay ? (
        <div className="p-5 bg-gray-800/50 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-green-400" />
              Registrar Pago
            </h3>
            <button
              onClick={() => setIsPay(false)}
              className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <CircleX className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <FormAbono debtID={id} setIsPay={setIsPay} monthlyPayment={monthlyPaymentWithInterest} />
        </div>
      ) : showAmortization ? (
        <div className="p-5 bg-gray-800/50 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Tabla de Amortización
            </h3>
            <button
              onClick={() => setShowAmortization(false)}
              className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <CircleX className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {amortization_table && amortization_table.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Mes</th>
                      <th className="text-right py-3 px-2 text-gray-400 font-medium">Cuota</th>
                      <th className="text-right py-3 px-2 text-gray-400 font-medium">Interés</th>
                      <th className="text-right py-3 px-2 text-gray-400 font-medium">Capital</th>
                      <th className="text-right py-3 px-2 text-gray-400 font-medium">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortization_table.slice(0, 6).map((row: any, i: number) => (
                      <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-2 text-white">{row.month}</td>
                        <td className="py-3 px-2 text-right text-green-400 font-medium">{formatCurrency(row.payment)}</td>
                        <td className="py-3 px-2 text-right text-yellow-400">{formatCurrency(row.interest)}</td>
                        <td className="py-3 px-2 text-right text-blue-400">{formatCurrency(row.principal)}</td>
                        <td className="py-3 px-2 text-right text-white">{formatCurrency(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {amortization_table.length > 6 && (
                <div className="text-center text-sm text-gray-400 mt-4">
                  Mostrando 6 de {amortization_table.length} meses
                  <span className="mx-2">•</span>
                  <button
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    onClick={() => {/* TODO: Implementar vista completa */}}
                  >
                    Ver tabla completa
                  </button>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total a pagar</p>
                    <p className="text-lg font-semibold text-red-400">
                      {formatCurrency(total_with_interest > 0 ? total_with_interest : (total_amount + total_interest))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Interés total</p>
                    <p className="text-lg font-semibold text-yellow-400">
                      {formatCurrency(total_interest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Cuota mensual</p>
                    <p className="text-sm font-medium text-green-400">
                      {formatCurrency(monthlyPaymentWithInterest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">% Interés total</p>
                    <p className="text-sm font-medium text-white">
                      {total_amount > 0 ? ((total_interest / total_amount) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No hay tabla de amortización disponible</p>
              <p className="text-sm text-gray-500 mt-1">Esta deuda no tiene tasa de interés configurada</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-5 bg-[#242424]/90 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Historial de Pagos
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({payments?.length || 0})
              </span>
            </h3>
            {payments?.length > 0 && (
              <span className="text-sm text-green-400 font-medium">
                Total: {formatCurrency(totalAmountPayments)}
              </span>
            )}
          </div>

          {payments?.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {payments?.map((pay: any, i) => (
                <div
                  key={pay.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {FormatDate(pay.pay_day)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {pay?.payment_type || 'Pago regular'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-green-400">
                      {formatCurrency(pay.pay_value)}
                    </span>
                    <div className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                      <DeleteConfirmation
                        deleteItem={() => handleDelete(pay.id, pay.debts_id, pay.pay_value)}
                        message="¿Está seguro de eliminar este pago?"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <PiggyBank className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No hay pagos registrados</p>
              <p className="text-sm text-gray-500 mt-1">
                Haz clic en el ícono de pago para registrar el primer abono
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
