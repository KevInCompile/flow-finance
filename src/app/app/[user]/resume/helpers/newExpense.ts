import { toast } from "sonner";
import createExpense from "../actions/expense.actions";

export const handleExpenseHelper = async (
  data: any,
  user: string | string[],
  fecha: string,
  value: string,
  setLoading: (loading: boolean) => void,
  addNewValue: (type: string) => void,
) => {
  setLoading(true);
  const [error] = await createExpense({
    accountId: data.accountid,
    categoryId: data.categoryid,
    username: user,
    description: data.description,
    date: fecha,
    value,
  });
  if (error) return toast.warning("Ups!...");
  addNewValue("expense");
  setLoading(false);
  return toast.success("New expense add!");
};
