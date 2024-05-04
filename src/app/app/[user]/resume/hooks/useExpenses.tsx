import { useEffect, useState } from "react";
import { toast } from "sonner";
import ExpensesFetch from "../services/expenses.service";

export interface ExpenseModel {
  id: number
  value: number
  accountname: string
  categoryname: string
  date: string
  description: string
  username: string
}
export default function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseModel[]>([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

 useEffect(() => {
   const getData = async () => {
     const [error, result] = await ExpensesFetch();
     if (error) return toast(error);
     setExpenses(result);
     setLoading(false);
   };
   getData();

   return () => setRefresh(false)
 }, [refresh])

 return {loading, expenses, setRefresh}
}