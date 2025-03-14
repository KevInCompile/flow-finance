import DeleteConfirmation from "@/app/components/DeleteConfirmation/DeleteConfirmation";
import { FormatDate } from "@/app/utils/FormatDate";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import { formatCurrency } from "../../utils/formatPrice";
import { DataAgruped } from "../../models/ExpensesIncomesModel";
import { Transactions } from "./models";
import { handleDeleteTransaction } from "../function/handleDeleteTransaction";


export default function TableTransactions(props: Transactions) {

  const gastosAgrupados = props.data.reduce((acc: DataAgruped[], gasto: any) => {
    const gastoExistente = acc.find(
      (g) => g.categoryname === gasto.categoryname,
    );
    if (gastoExistente) {
      gastoExistente.value =
        parseFloat(gastoExistente.value.toString()) + parseFloat(gasto.value);
      gastoExistente.details?.push(gasto);
    } else {
      acc.push({ ...gasto, value: parseFloat(gasto.value), details: [gasto] });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.value - a.value);

  const totalMoney = (type: string) => {
    return props.data.filter((item: any) => type === 'expense' ? item.type === 'expense' : item.type !== 'expense')
    .reduce((acc: any, item: any) => acc + parseFloat(item.value), 0);
  }

  return (
    <>
      {props.isAgruped ? (
        <header className="uppercase text-purple-500 font-bold border-b pb-5 mt-5 text-sm grid grid-cols-3 border-zinc-800 px-5 gap-6">
          <span>categoria</span>
          <span>tipo</span>
          <span>monto</span>
        </header>
      ) : (
        <header className="uppercase text-purple-500  border-b font-bold pb-5 mt-5 text-sm grid grid-cols-3 md:grid-cols-4 border-gray-500 px-5 gap-6">
          <span>nombre</span>
          <span>tipo</span>
          <span className="hidden md:block">fecha</span>
          <span>monto</span>
        </header>
      )}
      <div className="overflow-y-auto movimientos">
        {props.isAgruped
          ? gastosAgrupados.map((item: DataAgruped) => {
              const dateExpense = new Date(item.date_register);
              const monthExpense = dateExpense.getMonth();
              if (props.monthCurrent === monthExpense) {
                return (
                  <div
                    className="flex flex-col border-b border-zinc-800 listTable"
                    key={item.id}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="py-4 px-5 grid grid-cols-3 items-center text-sm md:text-md hover:bg-[#201D1] cursor-pointer gap-6 ">
                          <div className="flex items-center gap-2">
                            <div className="h-4 min-h-4 min-w-4 w-4 rounded" style={{background: item?.color ?? '#fff '}} />
                            <span className="font-light">
                              {item?.type === "expense"
                                ? item?.categoryname
                                : "Ingresos"}
                            </span>
                          </div>
                          {item?.type === "expense" ? (
                            <span className="text-red-400 bg-red-400/10 rounded-full p-1 md:p-2 text-center text-xs md:text-md">
                              Gasto
                            </span>
                          ) : (
                            <span className="text-green-400 bg-green-400/10 rounded-full p-1 md:p-2 text-center text-xs md:text-md">
                              Ingreso
                            </span>
                          )}
                          <span className="font-medium text-[#C59422]">
                            {formatCurrency(item?.value)}
                          </span>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-purple-500">
                            Detalles de {item.categoryname ?? "Incomes"}
                          </DialogTitle>
                          <DialogDescription>
                            Total: {formatCurrency(item?.value)}
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
                                      handleDeleteTransaction(
                                        item?.id,
                                        detalle.value,
                                        detalle.accountid,
                                        detalle?.typeincome!,
                                        props
                                      )
                                    }
                                    message={`Deseas eliminar ${detalle.description ?? detalle.typeincome}?`}
                                  />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {FormatDate(detalle.date_register)}
                                </div>
                              </div>
                              <div className="font-medium text-palette">
                                {formatCurrency(detalle?.value)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                );
              }
              return null; // Retorno nulo si no coincide el mes
            })
          : [...props.data].sort((a, b) => b.value - a.value).map((item: DataAgruped) => {
              const dateExpense = new Date(item.date_register);
              const monthExpense = dateExpense.getMonth();
              if (props.monthCurrent === monthExpense) {
                return (
                  <div className="flex flex-col" key={item.id}>
                    <div className="py-4 px-5 grid grid-cols-3 md:grid-cols-4 items-center border-b border-gray-500 text-sm md:text-md hover:bg-[#201D1D] cursor-pointer gap-6">
                      <div className="text-white">
                        <div className="flex flex-col gap-2">
                          <span className="font-light">
                            {item?.type === "expense"
                              ? item?.categoryname
                              : item?.typeincome}
                          </span>
                          <small className="font-light opacity-70 text-[#C59422]">
                            {item?.description}
                          </small>
                        </div>
                      </div>
                      <span className="hidden md:block">{item?.date_register}</span>
                      {item?.type === "expense" ? (
                        <span className="text-red-400 bg-red-400/10 rounded-full p-1 md:p-2 text-center text-xs md:text-md">
                          Expense
                        </span>
                      ) : (
                        <span className="text-green-400 bg-green-400/10 rounded-full p-1 md:p-2 text-center text-xs md:text-md">
                          Request
                        </span>
                      )}
                      <span className="font-medium text-[#C59422]">
                        {formatCurrency(item?.value)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {item?.details?.map((detalle) => (
                        <div
                          key={detalle.id}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <div className="text-sm text-muted-foreground">
                              {FormatDate(detalle.date_register)}
                            </div>
                          </div>
                          <div className="font-medium text-palette">
                            {formatCurrency(detalle?.value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null; // Retorno nulo si no coincide el mes
            })}
            <div className="px-5 py-4 text-sm grid grid-cols-2">
              <div className="mb-2">
                <span>Ingresos:</span> <span className="text-green-400">{formatCurrency(totalMoney('incomes'))}</span>
              </div>
              <div className="mb-2">
                <span>Gastos:</span> <span className="text-red-400">{formatCurrency(totalMoney('expense'))}</span>
              </div>
            </div>
      </div>
    </>
  );
}
