import { useEffect, useState } from "react";
import { toast } from "sonner";
import ExpensesFetch from "../services/expenses.service";
import { useParams } from "next/navigation";

export interface ExpenseModel {
  id: number;
  value: number;
  accountname: string;
  categoryname: string;
  date: string;
  description: string;
  username: string;
  type: string;
  typeincome?: string;
  details?: ExpenseModel[];
}
export default function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const { user } = useParams();

  useEffect(() => {
    const getData = async () => {
      const [error, result] = await ExpensesFetch(user as string);
      if (error) return toast(error);
      setExpenses(result);
      setLoading(false);
    };
    getData();

    return () => setRefresh(false);
  }, [refresh]);

  return { loading, expenses, setRefresh };
}
