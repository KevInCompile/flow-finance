import CircleProgress from "@/app/components/CircleProgress/CircleProgress";
import { useState } from "react";

interface CardData {
  description: string
  payday: number
  totalDue: number
  fee: number
}

export default function CardDebt({ data: data}: {data: CardData}) {
  const {description, payday, totalDue, fee} = data

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
            <form>
              <label className="block text-[var(--color-usage)] text-md font-medium pb-2 text-center">Cuanto quiere abonar a la deuda?</label>
              <input type='text' className="bg-[#242424] border border-gray-200 w-full p-2 rounded-md text-white" required/>
              <button className="block w-1/2 md:w-3/6 m-auto bg-[var(--color-usage)] p-2 rounded-full mt-3 font-medium text-sm">Registrar abono</button>
            </form>
          </div>
        )
        :(
          <article className="text-white p-4 text-center">
            <h1>Sin pagos registrados</h1>
          </article>
        )
      }
      {/* <article className="text-white p-4 grid grid-cols-2">
        <span><b className="text-palette">1.</b> $320.000</span>
        <span className="text-end">Pago</span>
      </article>
      <article className="text-white p-4 grid grid-cols-2">
        <span><b className="text-palette">2.</b> $580.000</span>
        <span className="text-end text-green-500 font-medium">+ Abono</span>
      </article> */}
    </div>
  )
}
