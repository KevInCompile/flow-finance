import { FormatDate } from "@/app/utils/FormatDate"
import DeleteConfirmation from "@/app/components/DeleteConfirmation/DeleteConfirmation"
import { IncomeModel } from "./hooks/useIncomes";

interface Props {
  monthCurrent: number,
  yearCurrent: number,
  incomes: IncomeModel[],
  deleteIncome: (id: number) => void
}

export default function TableExpenses(props: Props) {
  const {monthCurrent, yearCurrent, incomes:data, deleteIncome} = props

  const gastosFiltrados = data.filter(gasto => {
    let [año, mesA, día] = gasto.date.split('T')[0].split('-');
    mesA = mesA.startsWith('0') ? mesA.slice(1) : mesA;
    const fechaConvertida = `${año}-${mesA}-${día}`;
    const [anio, mes] = fechaConvertida.split("-")
    return parseInt(anio) === yearCurrent && parseInt(mes) - 1 === monthCurrent
  })

  return (
    <>
    <header className="uppercase text-white border-b pb-5 mt-5 text-sm grid grid-cols-3 md:grid-cols-4">
      <span>Cuenta</span>
      <span className="hidden md:block">Concepto</span>
      <span>Fecha</span>
      <span>Valor</span>
    </header>
    <div className='max-h-[400px] overflow-y-auto'>
      {
        gastosFiltrados.length >= 1 ?
          gastosFiltrados.map((item) => {
              const dateExpense = new Date(item.date)
              const monthExpense = dateExpense.getMonth()
              if (monthCurrent === monthExpense) {
                return (
                  <div className="py-5 grid grid-cols-3 md:grid-cols-4 items-center border-b text-sm md:text-md hover:bg-[#201D1D] cursor-pointer" key={item.id}>
                    <div className="flex gap-2 items-center text-white">
                      <div className="hidden md:block">
                        <DeleteConfirmation deleteItem={() => deleteIncome(item.id)}  message="¿Deseas eliminar este ingreso?" />
                      </div>
                        <div>
                          <span>{item?.account}</span>
                        </div>
                      </div>
                      <div>
                        <p className="opacity-70 text-sm">{item?.typeincome}</p>
                      </div>
                    <span className='text-white opacity-70'>{FormatDate(item?.date)}</span>
                    <span className='text-green-400 font-medium'> + $ {item?.value?.toLocaleString()}</span>
                  </div>
                )
              }
            }) : <></>
      }
      </div>
    </>
  )
}
