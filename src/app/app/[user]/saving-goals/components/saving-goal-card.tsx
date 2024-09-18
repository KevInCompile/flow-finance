import { Progress } from '@/components/ui/progress'
import DeleteConfirmation from '@/app/components/DeleteConfirmation/DeleteConfirmation'
import { toast } from 'sonner'
import { formatCurrency } from '../../resume/utils/formatPrice'
import { SavingGoalModel } from '../models/saving-goals.model'
import { deleteSavingGoal } from '../actions/delete.action'
import ModalAddMoneySavingGoal from '../modal/insert-money-saving'

export default function SavingGoalCard({
  data,
  setData,
}: {
  data: SavingGoalModel[]
  setData: any
}) {
  const handleDelete = async (id: number) => {
    const [error, message] = await deleteSavingGoal(id)
    if (message) {
      toast.success(message)
      setData(data.filter((item) => item.id !== id))
    } else {
      toast.error(error)
    }
  }
  return (
    <>
      {data.length >= 1 &&
        data.map((item) => (
          <div
            key={item?.id}
            className="rounded-xl border bg-[#1F1D1D] text-card-foreground shadow text-white p-6"
          >
            <div className="flex justify-between items-center mb-4">
              {' '}
              <h3 className="text-lg font-medium text-palette">
                {item?.namegoal}
              </h3>
              <div className="flex items-center">
                <ModalAddMoneySavingGoal
                  data={data}
                  id={item?.id}
                  setSaving={setData}
                />
                <DeleteConfirmation
                  deleteItem={() => handleDelete(item?.id)}
                  message="Do you want to delete this savings goal?"
                />
              </div>
            </div>
            <Progress
              value={(parseInt(item?.moneysaved) / parseInt(item?.goal)) * 100}
              className="h-2 bg-white mb-2"
            />
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(+item?.moneysaved)}</span>
              <span>{formatCurrency(+item?.goal)}</span>
            </div>
          </div>
        ))}
    </>
  )
}
