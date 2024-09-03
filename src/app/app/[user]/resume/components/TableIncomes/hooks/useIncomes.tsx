import { useEffect, useState } from "react";
import { serviceIncomes } from "../service/income.service";
import { useSession } from "next-auth/react";
import deleteIncomeService from "../../../services/delete-income.service";
import { toast } from "sonner";

interface IncomeModel {
  id: number
  username: string
  typeincome: string
  accountid: number
  value: number
  date: string
  account: string
}

export default function useIncomes () {
  const [data, setData] = useState<IncomeModel[]>([])
  const {data: session} = useSession()

  const getData = async () => {
    const response = await serviceIncomes(session?.user?.name ?? '')
    if(response.length) return setData(response)
    return setData([])
  }

  const deleteIncome = async (id: number) => {
    const [error, message] = await deleteIncomeService(id)
    if(error){
      toast.error(error)
    }else{
      toast.success(message)
      setData(data.filter(item => item.id !== id))
    }
  }

  useEffect(() => {
    getData()
  }, [session?.user?.name])


  return {
    data,
    deleteIncome
  }
}
