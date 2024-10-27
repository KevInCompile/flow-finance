import Input from '@/app/components/Input/Input'
import { SetStateAction, useState } from 'react'
import useCategories from '../../hooks/useCategories'
import { AccountModel } from '../../../accounts/models/account.model'
import { addNewValueHelper } from '../../helpers/addNewValue'
import { handleIncomeHelper } from '../../helpers/newIncome'
import { handleExpenseHelper } from '../../helpers/newExpense'
import { ExpenseModel } from '../../hooks/useExpenses'
import { IncomeModel } from '../../models/IncomeModel'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

interface Props {
  accounts: AccountModel[]
  setIncomes: React.Dispatch<SetStateAction<IncomeModel[]>>
  typeAction: string
  setAccounts: React.Dispatch<SetStateAction<AccountModel[]>>
  setExpenses: React.Dispatch<SetStateAction<ExpenseModel[]>>
}

const INITIAL_STATE = {
  description: '',
  categoryid: 0,
  accountid: 0,
  value: '',
}

export default function DialogNewExpense(props: Props) {
  const { accounts, setIncomes, typeAction, setAccounts, setExpenses } = props
  const [loading, setLoading] = useState(false)
  const { categories } = useCategories()

  const fecha = new Date().toISOString().split('T')[0]

  const [data, setData] = useState(INITIAL_STATE)
  const [open, setOpen] = useState(false)

  const sendMove = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (typeAction === 'expense') {
      return handleExpenseHelper(data, fecha, data.value, setLoading, setExpenses, addNewValue)
    } else {
      return handleIncomeHelper(data, data.value, fecha, setLoading, setIncomes, addNewValue)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value,
    })
  }

  const addNewValue = (type: string) => {
    return addNewValueHelper(type, accounts, data.accountid, data.value, setOpen, setData, setAccounts, INITIAL_STATE)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {typeAction === 'income' && (
        <button
          onClick={() => setOpen(true)}
          className={`flex items-center gap-1 text-primary justify-center p-4 border-r border-zinc-800 hover:bg-purple-600 ${accounts.length < 1 ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={accounts.length < 1}
        >
          <ArrowDownLeft className="text-purple-400" />
          <span className="text-sm">Request</span>
        </button>
      )}
      {typeAction === 'expense' && (
        <button
          className={`flex items-center gap-1 text-primary justify-center p-4 border-r border-zinc-800 rounded-bl-lg hover:bg-purple-600 ${accounts.length < 1 ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={accounts.length < 1}
          onClick={() => setOpen(true)}
        >
          <ArrowUpRight className="text-purple-400" />
          <span className="text-sm">Expense</span>
        </button>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-medium text-purple-500">
            {typeAction === 'expense' ? 'New expense' : 'New income'}
          </DialogTitle>
        </DialogHeader>
        <form id="form" className="py-5 text-white" onSubmit={sendMove}>
          <div className="flex flex-col gap-1 pb-2">
            <Input
              type="number"
              label="Amount"
              name="value"
              step="0.01"
              value={data.value}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <span>
              Account <span className="text-red-500">*</span>
            </span>
            <select
              className="selectField"
              name="accountid"
              value={data.accountid}
              defaultValue="0"
              onChange={handleChange}
              required
            >
              <option value="0" disabled>
                Select account
              </option>
              {accounts?.map((item) => (
                <option key={item?.id} value={item?.id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>
          {typeAction === 'expense' && (
            <div className="flex flex-col gap-1 pb-2">
              <span>
                What did you use it for? <span className="text-red-500">*</span>
              </span>
              <select
                className="selectField"
                value={data.categoryid}
                name="categoryid"
                defaultValue="0"
                onChange={handleChange}
                required
              >
                <option value="0" disabled>
                  Select a category
                </option>
                {categories?.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1 pb-2">
            <span>Description</span>
            <textarea
              className="rounded-md p-2 border-2 bg-transparent"
              name="description"
              rows={2}
              value={data.description}
              placeholder={typeAction === 'expense' ? 'Arepa' : 'Salary, Freelance, etc...'}
              onChange={handleChange}
            />
          </div>
          <div className="pb-2">
            <button
              disabled={loading}
              className="bg-palette text-black rounded-md p-2 w-3/12 float-right disabled:bg-opacity-70 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
