import DeleteConfirmation from '@/app/components/DeleteConfirmation/DeleteConfirmation'
import { FormatDate } from '@/app/utils/FormatDate'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatCOP } from '../../utils/formatPrice'
import { DataAgruped } from '../../models/ExpensesIncomesModel'
import { SetStateAction } from 'react'
import { AccountModel } from '../../../accounts/models/account.model'

interface Props {
  data: any
  monthCurrent: number
  accounts: AccountModel[]
  isAgruped: boolean
  deleteIncome: (id: number) => void
  deleteExpense: (id: number) => void
  setAccounts: React.Dispatch<SetStateAction<AccountModel[]>>
}

export default function TableTransactions(props: Props) {
  const {
    data,
    monthCurrent,
    isAgruped,
    deleteIncome,
    setAccounts,
    accounts,
    deleteExpense,
  } = props

  const handleDelete = (
    id: number,
    value: number,
    accountid: number,
    type: string
  ) => {
    const newValue = accounts.find((item) => item.id === accountid)
    if (type) {
      deleteIncome(id)
      const newData = {
        ...newValue,
        value: +newValue?.value! - value,
      }
      const newAccounts = accounts.map((account) =>
        account.id === accountid ? newData : account
      )
      setAccounts(newAccounts as any)
    } else {
      deleteExpense(id)
      const newData = {
        ...newValue,
        value: newValue?.value! + value,
      }
      console.log(newValue, value, accountid)
      const newAccounts = accounts.map((account) =>
        account.id === accountid ? newData : account
      )
      setAccounts(newAccounts as any)
    }
  }

  const gastosAgrupados = data.reduce((acc: DataAgruped[], gasto: any) => {
    const gastoExistente = acc.find(
      (g) => g.categoryname === gasto.categoryname
    )
    if (gastoExistente) {
      gastoExistente.value += gasto.value
      gastoExistente.details?.push(gasto)
    } else {
      acc.push({ ...gasto, details: [gasto] })
    }
    return acc
  }, [])

  return (
    <>
      {isAgruped ? (
        <header className="uppercase text-white border-b pb-5 mt-5 text-sm grid grid-cols-3 border-gray-500 px-5 gap-6">
          <span>name</span>
          <span>type</span>
          <span>value</span>
        </header>
      ) : (
        <header className="uppercase text-white border-b pb-5 mt-5 text-sm grid grid-cols-3 md:grid-cols-4 border-gray-500 px-5 gap-6">
          <span>name</span>
          <span>type</span>
          <span className="hidden md:block">date</span>
          <span>value</span>
        </header>
      )}
      <div className="overflow-y-auto movimientos">
        {isAgruped
          ? gastosAgrupados.map((item: DataAgruped) => {
              const dateExpense = new Date(item.date)
              const monthExpense = dateExpense.getMonth()
              if (monthCurrent === monthExpense) {
                return (
                  <div className="flex flex-col" key={item.id}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="py-4 px-5 grid grid-cols-3 items-center border-b border-gray-500 text-sm md:text-md hover:bg-[#201D1D] cursor-pointer gap-6">
                          <div className="text-white">
                            <span className="text-purple-500 font-light">
                              {item?.type === 'expense'
                                ? item?.categoryname
                                : item?.typeincome}
                            </span>
                          </div>
                          {item?.type === 'expense' ? (
                            <span className="text-red-400 bg-red-400/10 rounded-full p-1 md:p-2 text-center text-xs md:text-md">
                              Expense
                            </span>
                          ) : (
                            <span className="text-green-400 bg-green-400/10 rounded-full p-1 md:p-2 text-center text-xs md:text-md">
                              Request
                            </span>
                          )}
                          <span className="font-medium">
                            {formatCOP.format(item?.value)}
                          </span>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-purple-500">
                            Detalles de {item.categoryname ?? item.typeincome}
                          </DialogTitle>
                          <DialogDescription>
                            Total: ${item?.value?.toLocaleString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          {item?.details?.map((detalle) => (
                            <div
                              key={detalle.id}
                              className="flex justify-between items-center"
                            >
                              <div>
                                <div className="font-medium text-white flex items-center gap-1">
                                  {detalle.description ?? detalle.typeincome}
                                  <DeleteConfirmation
                                    deleteItem={() =>
                                      handleDelete(
                                        item?.id,
                                        detalle.value,
                                        detalle.accountid,
                                        detalle?.typeincome!
                                      )
                                    }
                                    message={`Deseas eliminar ${detalle.description ?? detalle.typeincome}?`}
                                  />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {FormatDate(detalle.date)}
                                </div>
                              </div>
                              <div className="font-medium text-palette">
                                ${detalle?.value?.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )
              }
              return null // Retorno nulo si no coincide el mes
            })
          : data.map((item: DataAgruped) => {
              const dateExpense = new Date(item.date)
              const monthExpense = dateExpense.getMonth()
              if (monthCurrent === monthExpense) {
                return (
                  <div className="flex flex-col" key={item.id}>
                    <div className="py-4 px-5 grid grid-cols-3 md:grid-cols-4 items-center border-b border-gray-500 text-sm md:text-md hover:bg-[#201D1D] cursor-pointer gap-6">
                      <div className="text-white">
                        <div className="flex flex-col gap-2">
                          <span className="text-purple-500 font-light">
                            {item?.type === 'expense'
                              ? item?.categoryname
                              : item?.typeincome}
                          </span>
                          <small className="font-light opacity-70">
                            {item?.description}
                          </small>
                        </div>
                      </div>
                      <span className="hidden md:block">{item?.date}</span>
                      {item?.type === 'expense' ? (
                        <span className="text-red-400 bg-red-400/10 rounded-full p-1 md:p-2 text-center text-xs md:text-md">
                          Expense
                        </span>
                      ) : (
                        <span className="text-green-400 bg-green-400/10 rounded-full p-1 md:p-2 text-center text-xs md:text-md">
                          Request
                        </span>
                      )}
                      <span className="font-medium">
                        {formatCOP.format(item?.value)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {item?.details?.map((detalle) => (
                        <div
                          key={detalle.id}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium text-white">
                              {detalle.description}{' '}
                              <DeleteConfirmation
                                deleteItem={() =>
                                  handleDelete(
                                    item?.id,
                                    detalle.value,
                                    detalle.accountid,
                                    detalle.typeincome!
                                  )
                                }
                                message={`�Deseas eliminar el gasto ${detalle.description}?`}
                              />
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {FormatDate(detalle.date)}
                            </div>
                          </div>
                          <div className="font-medium text-palette">
                            ${detalle?.value?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              return null // Retorno nulo si no coincide el mes
            })}
      </div>
    </>
  )
}
