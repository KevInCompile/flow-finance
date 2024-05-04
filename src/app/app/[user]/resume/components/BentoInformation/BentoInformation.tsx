import useAccounts from "../../../accounts/hooks/useAccounts"

export default function BentoInformation () {
  const {data, loading} = useAccounts()
  const accountMain = data.filter((item) => item.type === "principal")[0]
  const accountInversion = data.filter((item) => item.type === "inversion")[0]
  const accountSaving = data.filter((item) => item.type === "ahorros")[0]
  return (
    <div className='grid grid-cols-2'>
      <div className="py-4 px-5 flex flex-col gap-3 bg-gradient-to-r from-purple-200 to-purple-300 items-start rounded-tl-md">
        <span className="text-purple-500 font-medium">{accountMain?.name}</span>
        <h2 className="text-xl ">
          $ {accountMain?.value.toLocaleString()}
        </h2>
        <small className="bg-palette px-3 py-1 rounded-full">+10%</small>
      </div>
      <div className="py-4 px-5 flex flex-col gap-5 items-start text-white bg-[#1F1D1D] rounded-tr-md border-b border-r border-t">
        <span>Ahorros</span>
        { accountSaving ? <h2 className="text-xl font-medium">$ {accountSaving?.value.toLocaleString()}</h2> : <small>Aún no hay ahorros</small>}
      </div>
      <div className="py-4 px-5 flex flex-col gap-5 items-start text-white bg-[#1F1D1D] rounded-bl-md border-r border-b border-l">
        <span>Inversiones</span>
        <h2 className="text-xl font-medium">
          { accountInversion ? accountInversion.value.toLocaleString() : 'Aún no hay inversiones'}
        </h2>
        <small className="bg-[var(--color-usage)] text-black px-3 py-1 rounded-full">+15 R.A%</small>
      </div>
      <div className="py-4 px-5 flex flex-col gap-5 items-start  text-white bg-[#1F1D1D] rounded-br-md border-b border-r ">
        <span>Ultimo gasto</span>
        <h2 className="text-xl font-medium">
          $ 35,000
        </h2>
        <small className='text-palette'>Hamburguesa</small>
      </div>
    </div>
  )
}