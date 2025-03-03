import Input from '@/app/components/Input/Input'
import Modal from '@/app/components/Modal/Modal'
import useModal from '@/app/components/Modal/useModal'
import { toast } from 'sonner'
import { useState } from 'react'
import createDebt from '../actions/createDebts.action'

export default function ModalNewDebt() {
  const [valuesState, setValuesState] = useState('')
  const [loading, setLoading] = useState(false)
  const { handleCloseModal } = useModal()

  async function createAccount(formData: FormData): Promise<void> {
    try {
      setLoading(true)
      const [error] = await createDebt(formData)
      handleCloseModal()
      if (error) {
        toast.warning('Server error...')
        return
      }
      // reset form and values
      const $form = document.querySelector('#form') as HTMLFormElement
      $form.reset()
      setValuesState('')
      toast.success('New debt add!')
    }catch(error){
      toast.error('Error creating debt')
    }finally{
      setLoading(false)
    }

  }

  const formatedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    return setValuesState(value)
  }

  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">Crear nueva deuda</h1>
        </div>
        <form
          id="form"
          action={createAccount}
          className="my-5 flex flex-col gap-5 lg:grid lg:grid-cols-2 "
        >
          <Input
            type="text"
            label="Descripción"
            name="description"
            autoComplete="off"
          />
          <Input
            type="number"
            label="Monto total"
            name="totalamount"
            onChange={formatedValue}
            value={valuesState}
          />
          <Input type="number" label="Cuotas" name="installments" />
          <Input type="number" min='1' max='31' label="Dia de pago" name="paydate" />
          <Input type='date' label="Fecha de inicio" name="startdate" />
          <Input type='number' label="Tasa de interés" name="interest" />
        </form>
          <button
            form='form'
            disabled={loading}
            type="submit"
            className="bg-palette text-black rounded-md p-2 w-3/12 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Crear deuda
          </button>
      </div>
    </Modal>
  )
}
