"use client";

import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SavingsGoal {
  id: number;
  name: string;
  target: number;
  current: number;
}

export default function SavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: 1, name: "Vacaciones", target: 5000, current: 2500 },
    { id: 2, name: "Nuevo teléfono", target: 1000, current: 750 },
  ]);
  const [newGoal, setNewGoal] = useState({ name: "", target: "" });

  const addGoal = () => {
    if (newGoal.name && newGoal.target) {
      setGoals([
        ...goals,
        {
          id: goals.length + 1,
          name: newGoal.name,
          target: parseFloat(newGoal.target),
          current: 0,
        },
      ]);
      setNewGoal({ name: "", target: "" });
    }
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#1F1D1D]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-violet-400">
          Metas de Ahorro
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
                  {goal.current.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}{" "}
                  de{" "}
                  {goal.target.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
              <Button size="icon" onClick={() => deleteGoal(goal.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar meta</span>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex space-x-2">
          <Input
            placeholder="Nombre de la meta"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Cantidad objetivo"
            value={newGoal.target}
            onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
          />
          <Button onClick={addGoal}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
