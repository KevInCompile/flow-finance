import DeleteConfirmation from "@/app/components/DeleteConfirmation/DeleteConfirmation"
import { FormatDate } from "@/app/utils/FormatDate"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExpenseAgrupedModel } from "../../models/ExpenseAgruped"

interface Props {
  data: ExpenseAgrupedModel[]
  monthCurrent: number
  refresh: () => void
}

export default function TableExpenses (props: Props) {
  const { data, monthCurrent, refresh } = props

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
    <header className="uppercase text-white border-b pb-5 mt-5 text-sm grid grid-cols-3">
      <span>Categoria</span>
      <span >Cuenta</span>
      <span>Valor</span>
    </header>
    <div className='max-h-[400px] overflow-y-auto movimientos'>
      {
        data.length >= 1 ?
            data.map((item) => {
              const dateExpense = new Date(item.date)
              const monthExpense = dateExpense.getMonth()
              if (monthCurrent === monthExpense) {
                return (
                  <div className="flex flex-col" key={item.id}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="py-5 grid grid-cols-3 items-center border-b text-sm md:text-md hover:bg-[#201D1D] cursor-pointer">
                        <div className="flex gap-2 items-center text-white">
                          <div>
                            <span>{item?.categoryname}</span>
                          </div>
                        </div>
                          <p className="text-white opacity-70">{item?.accountname}</p>
                        <span className='text-red-400 font-medium'> - $ {item?.value?.toLocaleString()}</span>
                      </div>
                    </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className='text-[var(--color-usage)]'>Detalles de {item.categoryname}</DialogTitle>
                          <DialogDescription>
                            Total: ${item?.value?.toLocaleString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          {item?.details?.map((detalle) => (
                            <div key={detalle.id} className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-white">{detalle.description} <
                                  DeleteConfirmation deleteItem={() => handleDelete(item?.id)} message={`¿Deseas eliminar el gasto ${detalle.description}?`} /></div>
                                <div className="text-sm text-muted-foreground">{FormatDate(detalle.date)}</div>
                              </div>
                              <div className="font-medium text-palette">${detalle?.value?.toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )
              }
            }) : <></>
      }
      </div>
    </>
  )
}
