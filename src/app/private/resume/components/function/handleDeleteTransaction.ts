import { Transactions } from "../TableTransactions/models";

 export const handleDeleteTransaction = (id: number,value: number,accountid: number,type: string, props: Transactions) => {
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
