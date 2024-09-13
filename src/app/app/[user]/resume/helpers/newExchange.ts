import { SetStateAction } from 'react'
import { toast } from 'sonner'
import { exchangeService } from '../services/exchange.service'
import { IncomeModel } from '../models/IncomeModel'

export const handleExchangeHelper = async (
  fromAccount: string,
  toAccount: string,
  amount: number,
  user: string | string[],
  setOpen: (v: boolean) => void,
  setAccounts: React.Dispatch<SetStateAction<IncomeModel[]>>
) => {
  if (fromAccount === toAccount)
    return toast.warning('The accounts are the same')
  try {
    const [error, message] = await exchangeService({
      fromAccount,
      toAccount,
      amount,
      user,
    })
    if (error) return toast.error(error)
    // Update accounts after successful exchange
    setAccounts((prevAccounts) => {
      return prevAccounts.map((account) => {
        if (account.id === +fromAccount) {
          return {
            ...account,
            value: account.value - amount,
          }
        }
        if (account.id === +toAccount) {
          return {
            ...account,
            value: account.value + amount,
          }
        }
        return account
      })
    })
    toast.success(message)
    setOpen(false)
  } catch (e) {
    toast.error('Error')
  }
}
