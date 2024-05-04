import { useEffect, useState } from "react";
import ExpensesFetch from "../services/expenses.service";
import { toast } from "sonner";

interface ExpenseModel {
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

 useEffect(() => {
   const getData = async () => {
     const [error, result] = await ExpensesFetch();
     if (error) return toast(error);
     setExpenses(result);
     setLoading(false);
   };
   getData();
 }, [])

 return {loading, expenses}
}