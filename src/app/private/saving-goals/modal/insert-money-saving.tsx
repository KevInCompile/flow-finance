import { PiggyBank } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import useAccounts from '../../accounts/hooks/useAccounts'
import { moneySavingAction } from '../actions/add-money-saving.action'
import { useState } from 'react'
import { toast } from 'sonner'
import { SavingGoalModel } from '../models/saving-goals.model'

interface Props {
  id: number
  setSaving: any
  data: SavingGoalModel[]
}

export default function ModalAddMoneySavingGoal(props: Props) {
  const { id, setSaving, data: savingGoals } = props
  const [data, setData] = useState({
    amount: '',
    accountId: '',
  })
  const { data: accounts } = useAccounts()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const handleUpdate = async (e: any, body: any) => {
    e.preventDefault()
    if (data.accountId === '' || data.amount === '')
      return toast.info('All fields are required')
    const [error, message] = await moneySavingAction({
      ...body,
      savingGoalId: id,
    })
    if (message) {
      const findItem = savingGoals.find((item) => item.id === id)!
      console.log(findItem)
      const newData = {
        ...findItem,
        moneysaved: parseFloat(findItem?.money_saved) + parseFloat(data.amount),
      }
      const newSavingGoals = savingGoals.map((item) =>
        item.id === +id ? newData : item
      )
      setSaving(newSavingGoals)
      toast.success(message)
    } else {
      toast.success(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="mr-2 text-white hover:text-green-600 opacity-80">
          <PiggyBank className="h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-purple-500 text-2xl mb-4">
            Add to Savings Goal
          </DialogTitle>
          <DialogDescription>
            Choose an account and enter the amount to add to your savings goal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleUpdate(e, data)}>
          <div className="mb-4">
            <label htmlFor="fromAccount" className="text-sm">
              Account:
            </label>
            <select
              id="fromAccount"
              name="accountId"
              value={data.accountId}
              className="w-full bg-gray-700 p-2 rounded"
              onChange={handleChange}
            >
              <option>Select account</option>
              {accounts.map((account: any) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            <div className="my-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                value={data.amount}
                id="amount"
                type="number"
                name="amount"
                className="w-full bg-gray-700 p-2 rounded"
                placeholder="Enter amount"
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="submit"
              className="bg-purple-600 px-4 py-2 rounded mr-2"
            >
              Add to Savings
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
