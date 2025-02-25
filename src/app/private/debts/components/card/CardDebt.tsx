import { useState } from 'react'
import FormAbono from './FormPayment/FormPayment'
import DeleteConfirmation from '@/app/components/DeleteConfirmation/DeleteConfirmation'
import axios from 'axios'
import { toast } from 'sonner'
import { PropsCardDebt } from './models/card-debt.model'
import { formatCurrency } from '@/app/private/resume/utils/formatPrice'
import { FormatDate } from '@/app/utils/FormatDate'

export default function CardDebt(props: PropsCardDebt) {
  const { data, setData, fullData, deleteDebt } = props
  const { description, paydate, startdate, totalamount, installments, id, payments } = data

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
        totalamount: data.totalamount + value,
        payments: data.payments.filter((item) => item.id !== id),
      }
      setData([...fullData.filter((item) => item.id !== idDebt), filter])
    }
  }

   const totalAmountPayments = payments.reduce((sum, debt: any) => sum + debt.payvalue, 0)

  return (
    <div className="bg-[#191919] rounded-md py-2 border border-gray-500 relative">
      <div className="border-b border-palette px-3 pb-3 flex-wrap">
        <div>
          <h1 className="text-[var(--palette)] font-bold flex items-center gap-1 mb-2">
            {description}
            <DeleteConfirmation deleteItem={deleteDebt} message="¿Quiere eliminar la deuda?" />
          </h1>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <h2 className="text-purple-400 font-medium text-sm">
              Total amount: <span className='text-white'>{formatCurrency(totalamount)}</span>
            </h2>
            <h2 className="text-purple-400 font-medium text-sm text-end">
              Remaining amount: <span className='text-white'>{formatCurrency(totalamount - totalAmountPayments)}</span>
            </h2>
            <h2 className="text-purple-400 font-medium text-sm">
              Installments <span className='text-white'>{installments}</span>
            </h2>
            <h2 className="text-purple-400 font-medium text-sm text-end">
              Monthly payment <span className='text-white'>{formatCurrency(totalamount / installments)}</span>
            </h2>
            <h2 className="text-purple-400 font-medium text-sm">
              Next payment <span className='text-white'>{FormatDate(paydate)}</span>
            </h2>
            <h2 className="text-purple-400 font-medium text-sm text-end">
              Start date <span className='text-white'>{FormatDate(startdate)}</span>
            </h2>
          </div>
        {/* <button
          className={`rounded-md text-sm hover:scale-105 transition font-bold" ${isPay ? 'text-red-400' : 'text-green-400'}`}
          onClick={() => setIsPay(!isPay)}
        >
          {isPay ? 'Cancelar' : 'Abonar'}
        </button> */}
      </div>
      {isPay ? (
        <div className="p-4">
          <FormAbono debtID={id} setIsPay={setIsPay} />
        </div>
      ) : (
        <article className="text-white p-4 max-h-60 overflow-auto">
          <h1 className="text-center text-[1em]">{payments?.length > 0 ? 'Payment history' : 'No payments registered'}</h1>
          {payments?.length > 0 ? (
            <div className="grid grid-cols-2 opacity-50 text-sm pb-1">
              <span>Valor</span>
              <span className="text-end">Tipo</span>
            </div>
          ) : (
            <></>
          )}
          {payments?.map((pay: any, i) => (
            <article className="text-white grid grid-cols-2 py-1.5 border-b border-gray-500 text-sm" key={pay.id}>
              <span>
                <b className="text-palette">{i + 1}.</b> {FormatDate(pay.payday)}

              </span>
              <span className="text-end font-medium flex justify-end gap-2 text-xs">
                {formatCurrency(pay.payvalue)} {" "}
                <span className='text-green-500'>({pay?.paymenttype})</span>
                <DeleteConfirmation
                  deleteItem={() => handleDelete(pay.id, pay.debtsid, pay.payvalue)}
                  message="Do you want to delete the payment?"
                />
              </span>
            </article>
          ))}
        </article>
      )}
    </div>
  )
}
