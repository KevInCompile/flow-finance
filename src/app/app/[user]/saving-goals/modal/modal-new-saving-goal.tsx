import Input from '@/app/components/Input/Input'
import Modal from '@/app/components/Modal/Modal'
import useModal from '@/app/components/Modal/useModal'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { FormEvent, SetStateAction, useState } from 'react'
import axios from 'axios'
import { SavingGoalModel } from '../models/saving-goals.model'

export default function ModalNewSavingGoal({
  setSavingGoals,
}: {
  setSavingGoals: React.Dispatch<SetStateAction<SavingGoalModel[]>>
}) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    nameGoal: '',
    goal: '',
    moneySaved: '',
  })
  const { user } = useParams()
  const { handleCloseModal } = useModal()

  async function createSavingGoal(body: any) {
    setLoading(true)
    try {
      const fetching = await axios.post('/api/saving-goals', {
        ...body,
        username: user,
      })
      const { data } = fetching
      if (data.message) {
        toast.success('Meta de ahorro creada!')
      }
      setSavingGoals((prevState) => [...prevState, data.result])
    } catch (error) {
      toast.error(error as string)
    } finally {
      handleCloseModal()
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    createSavingGoal(data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }
  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">
            New savings goal
          </h1>
        </div>
        <form
          id="form"
          onSubmit={handleSubmit}
          className="my-5 flex flex-col gap-5"
        >
          <Input
            type="text"
            value={data.nameGoal}
            label="Name of goal"
            name="nameGoal"
            onChange={handleChange}
            autoComplete="off"
          />
          <Input
            type="number"
            step="2"
            label="Goal"
            name="goal"
            value={data.goal}
            onChange={handleChange}
          />
          <Input
            type="number"
            value={data.moneySaved}
            step="2"
            label="Ammount current"
            onChange={handleChange}
            name="moneySaved"
          />
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
