'use client'

import { Progress } from '@/components/ui/progress'
import useSavingGoals from '../hooks/useSavingGoals'
import { formatCurrency } from '../../resume/utils/formatPrice'

export default function VisualizerSavingGoals() {
  const { data, loading } = useSavingGoals()

  return (
    <>
      {data.length >= 1 && (
        <div className="pb-6">
          <h3 className="text-2xl font-bold text-purple-500 py-6">
            Metas de ahorro
          </h3>
          <div className="w-full max-w-3xl mx-auto bg-[#191919] rounded-xl p-4">
            <div className="space-y-4">
              {data.map((goal) => (
                <div key={goal.id} className="flex items-center space-x-6">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-[#C59422] pb-1">
                      {goal.name_goal}
                    </h3>
                    <Progress
                      value={(+goal.money_saved / +goal.goal) * 100}
                      className="h-2 bg-white"
                    />
                    <p className="text-sm text-gray-500 pt-1">
                      {formatCurrency(+goal.money_saved)} de{' '}
                      {formatCurrency(+goal.goal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
