import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAccounts from "../../../accounts/hooks/useAccounts"
import createIncome from "../../actions/income.actions"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function FormNewIncome() {
  const { data: accounts } = useAccounts()
  const { data: session } = useSession();

  const handleIncome = async (e: any) => {
    e.preventDefault()
    const monto = parseFloat(e.target.monto.value)
    const cuenta = e.target.accountid.value
    const concepto = e.target.concepto.value
    const fecha = new Date().toISOString().split('T')[0]

    const [error, data] = await createIncome({ accountId: cuenta, value: monto, typeIncome: concepto, username: session?.user?.name, date: fecha })
    if (error) {
     toast.error(error)
    } else {
      toast.success(data.message)
      e.target.reset()
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleIncome}>
      <div className="space-y-2">
        <Label htmlFor="monto">Monto</Label>
        <Input id="monto" name="monto"  type="number" placeholder="0" required  />
      </div>
      <div className="space-y-2">
        <Label htmlFor="concepto">Concepto</Label>
        <Input id="concepto" name="concepto" type="text" placeholder="Salario, Freelance, etc." required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="accountid">Cuenta</Label>
        <Select name="accountid" defaultValue="principal">
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una cuenta o deuda"/>
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {
              accounts.map((account) => {
                return (
                  <SelectItem key={account.id} value={account.id.toLocaleString()} className='text-black'>{account.name}</SelectItem>
                )
              })
            }
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-white">
        Realizar Ingreso
      </Button>
    </form>
  )
}
