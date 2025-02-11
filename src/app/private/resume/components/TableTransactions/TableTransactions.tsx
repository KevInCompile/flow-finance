import DeleteConfirmation from "@/app/components/DeleteConfirmation/DeleteConfirmation";
import { FormatDate } from "@/app/utils/FormatDate";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import { formatCurrency } from "../../utils/formatPrice";
import { DataAgruped } from "../../models/ExpensesIncomesModel";
import { Transactions } from "./models";


export default function TableTransactions(props: Transactions) {

  const handleDelete = (id: number,value: number,accountid: number,type: string) => {
    const newValue = props.accounts.find((item) => item.id === accountid);
    if (type) {
      props.deleteIncome(id);
      const newData = {
        ...newValue,
        value:
          parseFloat(newValue?.value?.toString() || "0") -
          parseFloat(value.toString()),
      };
      const newAccounts = props.accounts.map((account) =>
        account.id === accountid ? newData : account,
      );
      props.setAccounts(newAccounts as any);
    } else {
      props.deleteExpense(id);
      const newData = {
        ...newValue,
        value:
          parseFloat(newValue?.value?.toString() || "0") +
          parseFloat(value.toString()),
      };
      const newAccounts = props.accounts.map((account) =>
        account.id === accountid ? newData : account,
      );
      props.setAccounts(newAccounts as any);
    }
  };

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
  }, []);


  const totalMoney = (type: string) => {
    return props.data.filter((item: any) => type === 'expense' ? item.type === 'expense' : item.type !== 'expense')
    .reduce((acc: any, item: any) => acc + parseFloat(item.value), 0);
  }

  return (
    <>
      {props.isAgruped ? (
        <header className="uppercase text-purple-500 font-bold border-b pb-5 mt-5 text-sm grid grid-cols-3 border-zinc-800 px-5 gap-6">
          <span>name</span>
          <span>type</span>
          <span>value</span>
        </header>
      ) : (
        <header className="uppercase text-purple-500  border-b font-bold pb-5 mt-5 text-sm grid grid-cols-3 md:grid-cols-4 border-gray-500 px-5 gap-6">
          <span>name</span>
          <span>type</span>
          <span className="hidden md:block">date</span>
          <span>value</span>
        </header>
      )}
      <div className="overflow-y-auto movimientos">
        {props.isAgruped
          ? gastosAgrupados.map((item: DataAgruped) => {
              const dateExpense = new Date(item.date);
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
                          <div>
                            <span className="font-light">
                              {item?.type === "expense"
                                ? item?.categoryname
                                : "Incomes"}
                            </span>
                          </div>
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
                                      handleDelete(
                                        item?.id,
                                        detalle.value,
                                        detalle.accountid,
                                        detalle?.typeincome!,
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
          : props.data.map((item: DataAgruped) => {
              const dateExpense = new Date(item.date);
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
                      <span className="hidden md:block">{item?.date}</span>
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
                              {FormatDate(detalle.date)}
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
            <div className="px-5 py-4 text-sm">
              <div className="mb-2">
                <span>Total incomes:</span> <span className="text-green-400">{formatCurrency(totalMoney('incomes'))}</span>
              </div>
              <span>Total expenses:</span> <span className="text-red-400 mb-2">{formatCurrency(totalMoney('expense'))}</span>
            </div>
      </div>
    </>
  );
}
