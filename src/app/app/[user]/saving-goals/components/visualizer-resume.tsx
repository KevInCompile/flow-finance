'use client'

import { useState } from 'react'
import { Progress } from '@/components/ui/progress'
import useSavingGoals from '../hooks/useSavingGoals'
import { formatCurrency } from '../../resume/utils/formatPrice'

interface SavingsGoal {
  id: number
  name: string
  target: number
  current: number
}

export default function VisualizerSavingGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: 1, name: 'Vacaciones', target: 5000, current: 2500 },
    { id: 2, name: 'Nuevo teléfono', target: 1000, current: 750 },
  ])

  const { data, loading } = useSavingGoals()

  return (
    <div className="pb-6">
      <h3 className="text-2xl font-bold text-purple-500 py-6">Savings Goals</h3>
      <div className="w-full max-w-3xl mx-auto bg-[#1F1D1D] rounded-xl border border-gray-500 p-4">
        <div className="space-y-4">
          {data.map((goal) => (
            <div key={goal.id} className="flex items-center space-x-6">
              <div className="flex-grow">
                <h3 className="font-semibold pb-1">{goal.namegoal}</h3>
                <Progress
                  value={(+goal.moneysaved / +goal.goal) * 100}
                  className="h-2 bg-white"
                />
                <p className="text-sm text-gray-500 pt-1">
                  {formatCurrency(+goal.moneysaved)} de{' '}
                  {formatCurrency(+goal.goal)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
