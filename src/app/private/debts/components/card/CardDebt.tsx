import { useState } from 'react'
import FormAbono from './FormPayment/FormPayment'
import DeleteConfirmation from '@/app/components/DeleteConfirmation/DeleteConfirmation'
import axios from 'axios'
import { toast } from 'sonner'
import { PropsCardDebt } from './models/card-debt.model'

export default function CardDebt(props: PropsCardDebt) {
  const { data, setData, fullData, deleteDebt } = props
  const { description, payday, totaldue, fee, id, payments } = data

  const [isPay, setIsPay] = useState(false)

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
        totaldue: data.totaldue + value,
        payments: data.payments.filter((item) => item.id !== id),
      }
      setData([...fullData.filter((item) => item.id !== idDebt), filter])
    }
  }

  return (
    <div className="bg-[#191919] rounded-md py-2 border border-gray-500 relative">
      <div className="flex justify-between items-center border-b border-palette px-3 pb-2 flex-wrap">
        <div className="hidden md:block">
          <h2 className="text-purple-400 font-medium text-sm">Dia de pago: {payday}</h2>
        </div>
        <div className="text-center">
          <h1 className="text-[var(--palette)] font-bold flex items-center gap-1">
            ${totaldue?.toLocaleString()}
            <DeleteConfirmation deleteItem={deleteDebt} message="¿Quiere eliminar la deuda?" />
          </h1>
          <span className="text-[var(--color-usage)] text-sm">
            {description} <small className="bg-opacity-20 text-purple-500 text-sm font-bold">({fee})</small>
          </span>
        </div>
        <button
          className={`rounded-md text-sm hover:scale-105 transition font-bold" ${isPay ? 'text-red-400' : 'text-green-400'}`}
          onClick={() => setIsPay(!isPay)}
        >
          {isPay ? 'Cancelar' : 'Abonar'}
        </button>
      </div>
      {isPay ? (
        <div className="p-4">
          <FormAbono debtID={id} setIsPay={setIsPay} />
        </div>
      ) : (
        <article className="text-white p-4 max-h-60 overflow-auto">
          <h1 className="text-center text-[1em]">{payments?.length > 0 ? 'Pagos' : 'Sin pagos registrados'}</h1>
          {payments?.length > 0 ? (
            <div className="grid grid-cols-2 opacity-50 text-sm pb-1">
              <span>Valor</span>
              <span className="text-end">Tipo</span>
            </div>
          ) : (
            <></>
          )}
          {payments?.map((pay: any, i) => (
            <article className="text-white grid grid-cols-2 py-1.5 border-b border-gray-500" key={pay.id}>
              <span>
                <b className="text-palette">{i + 1}.</b> ${pay.payvalue.toLocaleString()}
              </span>
              <span className="text-end text-green-500 font-medium flex justify-end gap-2 text-sm">
                {pay?.paymenttype}
                <DeleteConfirmation
                  deleteItem={() => handleDelete(pay.id, pay.debtsid, pay.payvalue)}
                  message="Quiere eliminar el pago?"
                />
              </span>
            </article>
          ))}
        </article>
      )}
    </div>
  )
}
