import { SavingGoalModel } from '../models/savingGoal.model'
import { Progress } from '@/components/ui/progress'
import DeleteConfirmation from '@/app/components/DeleteConfirmation/DeleteConfirmation'
import { toast } from 'sonner'

export default function SavingGoalCard({
  data,
  setData,
}: {
  data: SavingGoalModel[]
  setData: any
}) {
  async function deleteItem(id: number) {
    try {
      await fetch(`/api/saving-goal?id=${id}`, {
        method: 'DELETE',
      })
      setData(data.filter((item) => item.id !== id))
      return toast('Meta de ahorro eliminada correctamente!')
    } catch (error) {
      toast('Error al eliminar la meta de ahorro...')
    }
  }

  return (
    <>
      {data.length >= 1 &&
        data.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border bg-[#1F1D1D] text-card-foreground shadow text-white p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-palette">{item.name}</h3>
              <DeleteConfirmation
                deleteItem={() => deleteItem(item.id)}
                message="¿Deseas eliminar esta meta de ahorro?"
              />
            </div>
            <Progress
              value={(item.current / item.target) * 100}
              className="h-2 mb-2"
            />
            <div className="flex justify-between text-sm">
              <span>
                {item.current.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })}
              </span>
              <span>
                {item.target.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })}
              </span>
            </div>
          </div>
        ))}
    </>
  )
}
