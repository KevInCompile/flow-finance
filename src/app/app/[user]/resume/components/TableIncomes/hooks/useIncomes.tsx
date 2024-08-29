import { useEffect, useState } from "react";
import { serviceIncomes } from "../service/income.service";
import { useSession } from "next-auth/react";

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

  useEffect(() => {
    getData()
  }, [])


  return {
    data
  }
}
