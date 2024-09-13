import { SetStateAction } from "react";
import { AccountModel } from "../../accounts/models/account.model";

export const addNewValueHelper = (
  type: string,
  accounts: AccountModel[],
  accountId: number,
  value: string,
  handleCloseModal: () => void,
  setData: React.Dispatch<SetStateAction<typeof INITIAL_STATE>>,
  setValue: React.Dispatch<SetStateAction<string>>,
  setAccounts: React.Dispatch<SetStateAction<AccountModel[]>>,
  INITIAL_STATE: any,
) => {
  const numericValue = parseInt(value.replace(/,/g, ""));
  const newValue = accounts.find((item) => item.id === +accountId);
  const newData = {
    ...newValue,
    value:
      type === "income"
        ? +newValue?.value! + numericValue
        : +newValue?.value! - numericValue,
  };
  const newAccounts = accounts.map((account) =>
    account.id === +accountId ? newData : account,
  );
  handleCloseModal();
  setData(INITIAL_STATE);
  setValue("");
  return setAccounts(newAccounts as any);
};
