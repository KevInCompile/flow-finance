import { SetStateAction } from 'react'
import { AccountModel } from '../../accounts/models/account.model'

export const addNewValueHelper = (
  type: string,
  accounts: AccountModel[],
  accountId: number,
  value: string,
  setOpen: (v: boolean) => void,
  setData: React.Dispatch<SetStateAction<typeof INITIAL_STATE>>,
  setAccounts: React.Dispatch<SetStateAction<AccountModel[]>>,
  INITIAL_STATE: any,
) => {
  const newValue = accounts.find((item) => item.id === +accountId)
  const newData = {
    ...newValue,
    value:
      type === 'income'
        ? parseFloat(newValue?.value!) + parseFloat(value)
        : parseFloat(newValue?.value!) - parseFloat(value),
  }
  const newAccounts = accounts.map((account) => (account.id === +accountId ? newData : account))
  setData(INITIAL_STATE)
  setOpen(false)
  return setAccounts(newAccounts as any)
}
