import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SendToBack } from 'lucide-react'
import { useState } from 'react'
import { handleExchangeHelper } from '../../helpers/newExchange'

export default function ModalExchange(props: any) {
  const { accounts, setAccounts } = props
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        className={`flex items-center gap-1 text-primary justify-center p-4 hover:bg-purple-600 rounded-br-lg ${accounts.length < 1 ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={accounts.length < 1}
        onClick={() => setOpen(true)}
      >
        <SendToBack className="text-purple-400" />
        <span className="text-sm">Exchange</span>
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-purple-500 text-2xl mb-4">
            Exchange Money
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const fromAccount = (e.target as any).fromAccount.value
            const toAccount = (e.target as any).toAccount.value
            const amount = parseFloat((e.target as any).amount.value)
            handleExchangeHelper(
              fromAccount,
              toAccount,
              amount,
              setOpen,
              setAccounts
            )
          }}
        >
          <div className="mb-4">
            <label htmlFor="fromAccount" className="block mb-2">
              From Account:
            </label>
            <select
              id="fromAccount"
              name="fromAccount"
              className="w-full bg-gray-700 p-2 rounded"
            >
              {accounts.map((account: any) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="toAccount" className="block mb-2">
              To Account:
            </label>
            <select
              id="toAccount"
              name="toAccount"
              className="w-full bg-gray-700 p-2 rounded"
            >
              {accounts.map((account: any) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-2">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="w-full bg-gray-700 p-2 rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 px-4 py-2 rounded mr-2"
            >
              Exchange
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
