import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Salary {
  salary_net_monthly: number
  hire_date: Date
  pay_frequency: string
  salary_accumulated: number
}

const processData = (data: Salary) => {
  return {
    salary_net_monthly: Number(data.salary_net_monthly),
    hire_date: data.hire_date,
    pay_frequency: data.pay_frequency
  }
}

export default function useSalary() {
  const [loading, setLoading] = useState(true)
  const [salary, setSalary] = useState({} as Salary)

  const fetching = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/salary')
      const { data } = response
      let infoSalary = processData(data.result)
      const dailySalary = infoSalary.salary_net_monthly / 30;
      const startDate = new Date(infoSalary.hire_date);
      startDate.setHours(0, 0, 0, 0);
      console.log(startDate)

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // Inicio del mes actual
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      // Se toma la fecha más reciente entre ingreso y inicio del mes
      const effectiveStartDate =
        startDate > startOfMonth ? startDate : startOfMonth;

      if (effectiveStartDate > currentDate) {
        return 0;
      }

      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const daysWorked =
        Math.floor(
          (currentDate.getTime() - effectiveStartDate.getTime()) /
            millisecondsPerDay
        ) + 1; // incluye hoy


      setSalary({
        hire_date: infoSalary.hire_date,
        salary_net_monthly: infoSalary.salary_net_monthly,
        pay_frequency: infoSalary.pay_frequency,
        salary_accumulated: Math.round(dailySalary * daysWorked)
      })

    } catch (error) {
      toast.error(error as string)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetching()
  }, [])

  return {
    salary, loading
  }
}
