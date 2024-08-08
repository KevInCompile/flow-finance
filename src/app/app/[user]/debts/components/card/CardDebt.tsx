import { FormatDate } from "@/app/utils/FormatDate";
import { useState } from "react";
import FormAbono from "./FormPayment/FormPayment";

interface CardData {
  id: number
  description: string
  payday: number
  totalDue: number
  fee: number,
  payments: []
}

export default function CardDebt({ data: data}: {data: CardData}) {
  const {description, payday, totalDue, fee, id, payments} = data

  const [isPay, setIsPay] = useState(false)

  return (
    <div className="bg-[#242424/50] rounded-md py-2 border border-gray-500 relative">

      <div className="flex justify-between items-center border-b border-palette px-3 pb-2 flex-wrap">
        <div className="hidden md:block">
          <h2 className="text-[var(--color-usage)] font-medium text-sm">Dia de pago: {payday}</h2>
        </div>
        <div className="text-center">
          <h1 className="text-[var(--color-palette)] font-bold">${totalDue.toLocaleString()} </h1>
          <span className="text-[var(--color-usage)] text-sm">{description} <small className="bg-opacity-20 text-gray-300 text-sm font-bold">({fee})</small></span>
        </div>
        {/* <div className="">
          <CircleProgress progress='0'/>
        </div> */}
        <button className={`rounded-md text-sm hover:scale-105 transition font-bold" ${isPay ? 'text-red-400' : 'text-green-400'}`} onClick={() => setIsPay(!isPay)}>{isPay ? 'Cancelar' : 'Abonar'}</button>
      </div>

      {
        isPay ? (
          <div className="p-4">
            <FormAbono debtID={id} />
          </div>
        )
        :(
          <article className="text-white p-4 ">
            <h1 className="text-center">{ payments.length > 0 ? 'Pagos' : 'Sin pagos registrados'}</h1>
              {
              payments.map((pay: any, i) => (
                <article className="text-white grid grid-cols-2" key={pay.id}>
                  <span><b className="text-palette">{i + 1}.</b> $ {pay.payvalue.toLocaleString()}</span>
                  <span className="text-end text-green-500 font-medium">+ {pay.paymenttype}</span>
                </article>
              ))
            }
          </article>
        )
      }
      {/* <article className="text-white p-4 grid grid-cols-2">
        <span><b className="text-palette">1.</b> $320.000</span>
        <span className="text-end">Pago</span>
      </article>*/}

    </div>
  )
}
