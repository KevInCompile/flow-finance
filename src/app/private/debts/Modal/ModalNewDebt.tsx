import Input from '@/app/components/Input/Input'
import Modal from '@/app/components/Modal/Modal'
import useModal from '@/app/components/Modal/useModal'
import { toast } from 'sonner'
import { useState } from 'react'
import createDebt from '../actions/createDebts.action'

export default function ModalNewDebt() {
  const [valuesState, setValuesState] = useState({
    totalDue: '',
    feeValue: '',
  })
  const [loading, setLoading] = useState(false)
  const { handleCloseModal } = useModal()

  async function createAccount(formData: FormData): Promise<void> {
    setLoading(true)
    const [error] = await createDebt(formData)
    handleCloseModal()
    if (error) {
      toast.warning('Error al registrar la deuda...')
      return
    }
    // reset form and values
    const $form = document.querySelector('#form') as HTMLFormElement
    $form.reset()
    setValuesState({
      totalDue: '',
      feeValue: '',
    })
    // Finally create
    setLoading(false)
    toast.success('Deuda registrada!')
  }

  const formatedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const validateNumber = /^[0-9,]*$/.test(value)
    if (value === '') return setValuesState({ ...valuesState, [name]: '0' })
    if (!validateNumber) return
    let numberWithoutComma = parseFloat(value.replace(/,/g, ''))
    return setValuesState({
      ...valuesState,
      [name]: Number(numberWithoutComma).toLocaleString(),
    })
  }

  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">Debt</h1>
        </div>
        <form
          id="form"
          action={createAccount}
          className="my-5 flex flex-col gap-5"
        >
          <Input
            type="text"
            label="Description"
            name="description"
            autoComplete="off"
          />
          <Input
            type="text"
            label="Amount Owed"
            name="totalDue"
            onChange={formatedValue}
            value={valuesState.totalDue}
          />
          <Input type="number" label="Fee" name="fee" />
          <Input
            type="text"
            label="Fee Value"
            name="feeValue"
            onChange={formatedValue}
            value={valuesState.feeValue}
          />
          <Input type="number" max="31" min="1" label="Payday" name="payday" />
          <div>
            <button
              disabled={loading}
              type="submit"
              className="bg-palette text-black rounded-md p-2 w-3/12 float-right disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
