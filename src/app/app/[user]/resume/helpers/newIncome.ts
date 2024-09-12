import { toast } from "sonner";
import createIncome from "../actions/income.actions";
import { IncomeModel } from "../models/IncomeModel";

export const handleIncomeHelper = async (
  data: any,
  value: string,
  user: string | string[],
  fecha: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIncomes: React.Dispatch<React.SetStateAction<IncomeModel[]>>,
  addNewValue: (type: string) => void,
) => {
  setLoading(true);
  try {
    const [error, response] = await createIncome({
      accountId: data.accountid,
      value,
      typeIncome: data.description,
      username: user,
      date: fecha,
    });
    setIncomes((prevIncomes) => [...prevIncomes, response.result]);
    addNewValue("income");
    toast.success("New income added!");
  } catch (error: any) {
    toast.error(error.message || "An error occurred");
  } finally {
    setLoading(false);
  }
};
