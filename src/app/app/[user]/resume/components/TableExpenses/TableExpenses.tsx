import DeleteConfirmation from "@/app/components/DeleteConfirmation/DeleteConfirmation"
import { FormatDate } from "@/app/utils/FormatDate"
import { toast } from "sonner"
import { ExpenseModel } from "../../hooks/useExpenses"

export default function TableExpenses ({data, refresh}: {data: ExpenseModel[], refresh: any}) {

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/expenses?id=${id}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    refresh()
    if(data) toast.info('Gasto eliminado, dinero devuelto a la cuenta...')
  }

  return (
    <>
    <header className="uppercase text-white border-b pb-5 mt-5 text-sm grid grid-cols-3 md:grid-cols-4">
      <span>Categoria</span>
      <span className="hidden md:block">Descripción</span>
      <span>Fecha</span>
      <span>Valor</span>
    </header>
    <div className='max-h-[400px] overflow-y-auto'>
      {
        data.length >= 1 ?
        data.map((item) => (
          <div key={item.id} className="py-5 grid grid-cols-3 md:grid-cols-4 items-center border-b text-sm md:text-md hover:bg-[#201D1D] cursor-pointer">
          <div className="flex gap-2 items-center text-white">
            <div className="hidden md:block">
              {/* <FoodIcon /> */}
              <DeleteConfirmation deleteItem={() => handleDelete(item?.id)} message="¿Deseas eliminar este gasto?" />
            </div>
            <div>
              <span>{item?.categoryname}</span>
              <p className="block md:hidden opacity-70 text-sm">{item?.description}</p>
            </div>
          </div>
          <p className="text-white opacity-70 hidden md:block">{item?.description !== '' ? item.description : 'Sin descripción'}</p>
          <span className='text-white opacity-70'>{FormatDate(item?.date)}</span>
          <span className='text-palette font-medium'>$ {item?.value?.toLocaleString()}</span>
        </div>
        )) : <></>
      }
      </div>
    </>
  )
}
