import Input from '@/app/components/Input/Input'
import Modal from '@/app/components/Modal/Modal'
import useModal from '@/app/components/Modal/useModal'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function ModalNewSavingGoal({
  refresh,
}: {
  refresh: (value: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const { user } = useParams()
  const { handleCloseModal } = useModal()

  async function createSavingGoal(formData: FormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/saving-goal', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.message) {
        handleCloseModal()
        refresh(true)
        toast.success('Meta de ahorro creada!')
      }
    } catch (error) {
      toast.error('Error al crear la meta de ahorro...')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">
            Nueva meta de ahorro
          </h1>
        </div>
        <form
          id="form"
          action={createSavingGoal}
          className="my-5 flex flex-col gap-5"
        >
          <Input
            type="text"
            label="Usuario"
            value={user as string}
            name="username"
            hidden
            readOnly
          />
          <Input
            type="text"
            label="Nombre de la meta"
            name="name"
            autoComplete="off"
          />
          <Input type="number" label="Objetivo" name="target" />
          <Input type="number" label="Monto actual" name="current" />
          <div>
            <button
              disabled={loading}
              type="submit"
              className="bg-palette text-black rounded-md p-2 w-3/12 float-right disabled:bg-opacity-70 disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
