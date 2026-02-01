"use client";

import { useEffect, useState } from "react";
import Head from "@/app/components/Head/Head";
import useAccounts from "../accounts/hooks/useAccounts";
import useExpenses from "./hooks/useExpenses";
import { monthNames } from "@/app/utils/months";
import BackIcon from "./assets/back";
import NextIcon from "./assets/nextIcon";
import useIncomes from "./hooks/useIncomes";
import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";
import dynamic from "next/dynamic";
import Tour from "./utils/steps-tour";
import WrapperTable from "./components/TableTransactions/WrapperTable";
import RegisterSalaryModal from "./components/Modals/RegisterSalary";
import useSalary from "./hooks/useSalary";
import { formatCurrency } from "./utils/formatPrice";

const BentoInformation = dynamic(
  () => import("./components/BentoInformation/BentoInformation"),
  { ssr: false },
);

export default function Resume() {
  const { data: accounts, loading: loadingAccounts, setData: setAccounts } = useAccounts();
  const { expenses, loading: loadingExpenses, setExpenses, deleteExpense } = useExpenses();
  const { salary, loading: loadingSalary, setRefetching } = useSalary()
  const { data: incomes, deleteIncome, setData: setIncomes } = useIncomes();
  const [mesActual, setMesActual] = useState(0);
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());
  const [tour, setTour] = useState(false);
  // const [showAI, setShowAI] = useState(false);

  const currentDate = new Date();
  const monthName = monthNames[mesActual];

  useEffect(() => {
    setMesActual(currentDate.getMonth());
  }, []);

  // Combines expenses and incomes into a single transactions array
  const transactions = [...expenses, ...incomes];

  // Filters transactions for the current month and year, and sorts them by date
  const transactionsFilterForDate = transactions
    .filter((gasto) => {
      if (!gasto.date_register) return false;
      const [year, month] = gasto.date_register.split("-");
      return parseInt(year) === anioActual && parseInt(month) - 1 === mesActual;
    })
    .sort((a, b) => new Date(b.date_register).getTime() - new Date(a.date_register).getTime());

  const cambiarMes = (direccion: string) => {
    setMesActual((prevMes) => {
      if (direccion === "anterior") {
        return prevMes === 0 ? 11 : prevMes - 1;
      } else {
        return prevMes === 11 ? 0 : prevMes + 1;
      }
    });
    if (mesActual === 0 && direccion === "anterior") {
      setAnioActual((prevAnio) => prevAnio - 1);
    } else if (mesActual === 11 && direccion === "siguiente") {
      setAnioActual((prevAnio) => prevAnio + 1);
    }
  };

  console.log({transactionsFilterForDate})

  return (
    <>
      <Head />
      <section className="w-full md:w-[100%] px-5 mt-5 md:px-10">
        <div className="p-4 md:p-6 mb-2">
          <div className="flex justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-lg md:text-2xl font-semibold text-purple-500 animate-fade-in">
                  Balance de {monthName}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-purple-400 hover:bg-purple-400/10"
                  onClick={() => setTour(true)}
                >
                  <CircleHelp className="h-4 w-4" />
                </Button>
              </div>

              {loadingSalary ? (
                <div className="flex flex-col space-y-2">
                  <div className="bg-gray-700 rounded-md animate-pulse h-4 w-40" />
                  <div className="bg-gray-700 rounded-md animate-pulse h-3 w-32" />
                </div>
              ) : !salary.salary_net_monthly ? (
                <RegisterSalaryModal setRefetching={setRefetching} />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">Salario acumulado:</span>
                  <span className="text-green-400 font-medium">
                    {formatCurrency(salary.salary_accumulated)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="border border-gray-600 rounded-lg p-2 hover:bg-purple-500/20 hover:border-purple-500 transition-colors"
                title="Mes anterior"
                onClick={() => cambiarMes("anterior")}
              >
                <BackIcon />
              </button>
              <button
                className="border border-gray-600 rounded-lg p-2 hover:bg-purple-500/20 hover:border-purple-500 transition-colors"
                title="Mes siguiente"
                onClick={() => cambiarMes("siguiente")}
              >
                <NextIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-14 items-start">
          <BentoInformation
            expenses={transactionsFilterForDate}
            accounts={accounts}
            setIncomes={setIncomes}
            setAccounts={setAccounts}
            loadingAccounts={loadingAccounts}
            setExpenses={setExpenses}
          />
          {/*{showAI ? (
            <AIResponse totalMoney={totalMoney}  />
          ) : (*/}
            <WrapperTable
              transactionsFilterForDate={transactionsFilterForDate}
              loadingExpenses={loadingExpenses}
              monthCurrent={mesActual}
              deleteIncome={deleteIncome}
              setAccounts={setAccounts}
              accounts={accounts}
              deleteExpense={deleteExpense}
            />
          {/*)}*/}
        </div>
      </section>
      <Tour runTour={tour} />
    </>
  );
}
