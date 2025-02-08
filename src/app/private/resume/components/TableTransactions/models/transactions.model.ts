import { AccountModel } from "@/app/private/accounts/models/account.model";

export interface Transactions {
    data: any;
    monthCurrent: number;
    accounts: AccountModel[];
    isAgruped: boolean;
    deleteIncome: (id: number) => void;
    deleteExpense: (id: number) => void;
    setAccounts: React.Dispatch<React.SetStateAction<AccountModel[]>>;
  }