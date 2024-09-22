import Input from '@/app/components/Input/Input'
import Modal from '@/app/components/Modal/Modal'
import createItem from '../actions/createAccount.action'
import useModal from '@/app/components/Modal/useModal'
import { toast } from 'sonner'
import { useState } from 'react'

export default function ModalNewAccount() {
  const [loading, setLoading] = useState(false)
  const { handleCloseModal } = useModal()

  async function createAccount(formData: FormData) {
    setLoading(true)
    const [error] = await createItem(formData)
    handleCloseModal()
    if (error) return toast.warning('Error al crear la cuenta...')
    // reset form and values
    const $form = document.querySelector('#form') as HTMLFormElement
    $form.reset()
    // Finally create
    setLoading(false)
    return toast.success('Cuenta creada!')
  }

  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">New account</h1>
        </div>
        <form
          id="form"
          action={createAccount}
          className="my-5 flex flex-col gap-5"
        >
          <Input
            type="text"
            label="Name of account"
            name="name"
            autoComplete="off"
          />
          <Input type="number" label="Amount" name="value" />
          <select className="selectField" name="type">
            <option disabled selected>
              Choose a type
            </option>
            <option value="main">Main</option>
            <option value="savings">Savings</option>
            <option value="investment">Investments</option>
            <option value="otra">Otra</option>
          </select>
          <div>
            <button
              disabled={loading}
              type="submit"
              className="bg-palette text-black rounded-md p-2 w-3/12 float-right disabled:bg-opacity-70 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
