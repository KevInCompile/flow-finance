import SkeletonResume from "@/app/loaders/SkeletonResume"
import { AccountModel } from "../../../accounts/models/account.model"

export default function BentoInformation ({data, loading}: {data: AccountModel[], loading: boolean}) {
  const accountMain = data?.filter((item) => item.type === "principal")[0]
  const accountInversion = data?.filter((item) => item.type === "inversion")[0]
  const accountSaving = data?.filter((item) => item.type === "ahorros")[0]
  const proxDebt = data?.filter((item) => item.type === "deuda")[0]

  return (
    <div className='grid grid-cols-2 min-h-[290px] max-h-[290px]'>
      <div className="py-4 px-5 flex flex-col gap-3 bg-gradient-to-r from-purple-200 to-purple-300 items-start rounded-tl-md">
        {
          loading ? <SkeletonResume />
          : (
            <>
            <span className="text-purple-500 font-medium">{accountMain ? accountMain?.name : 'Sin cuenta principal'}</span>
              <h2 className="text-md md:text-xl">
                { accountMain ? '$ ' + accountMain?.value?.toLocaleString() : <small>Sin registros</small>}
              </h2>
              <small className="bg-palette px-3 py-1 rounded-full">+0 %</small>
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
      <div className="py-4 px-5 flex flex-col gap-3 items-start text-white bg-[#1F1D1D] rounded-bl-md border-r border-b border-l">
        {
          loading ? <SkeletonResume /> :
          (
            <>
              <span>Inversiones</span>
              <h2 className="text-md md:text-xl">
                { accountInversion ? accountInversion?.value?.toLocaleString() : <small>Sin registros</small>}
              </h2>
              <small className="bg-[var(--color-usage)] text-black px-3 py-1 rounded-full">+0 R.A%</small>
            </>
          )
        }
      </div>
      <div className="py-4 px-5 flex flex-col gap-3 items-start  text-white bg-[#1F1D1D] rounded-br-md border-b border-r ">
        {
          loading ? <SkeletonResume /> :
          (
            <>
              <span>Próximo pago</span>
              <h2 className="text-xl font-medium">
                { proxDebt ? proxDebt?.value?.toLocaleString() : <small>Sin deudas</small>}
              </h2>
              <small className='text-palette'>No aplica</small>
            </>
          )
        }
      </div>
    </div>
  )
}
