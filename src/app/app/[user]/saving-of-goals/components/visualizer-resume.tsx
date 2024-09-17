'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#1F1D1D] my-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-500">
          Savings Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center space-x-4">
              <div className="flex-grow">
                <h3 className="font-semibold">{goal.name}</h3>
                <Progress
                  value={(goal.current / goal.target) * 100}
                  className="h-2 bg-white"
                />
                <p className="text-sm text-gray-500">
                  {goal.current.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  })}{' '}
                  de{' '}
                  {goal.target.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
