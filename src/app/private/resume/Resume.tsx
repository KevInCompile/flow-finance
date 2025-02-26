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
import AIIcon from "@/app/icons/AI-Icon";
import AIResponse from "./components/AiResponse/AiResponse";
import WrapperTable from "./components/TableTransactions/WrapperTable";

const BentoInformation = dynamic(
  () => import("./components/BentoInformation/BentoInformation"),
  { ssr: false },
);

export const aiResponse = `¡Hola! Con los ingresos y gastos que has proporcionado, aquí tienes algunos consejos para mejorar tu situación financiera:

### 1. **Analiza tu situación actual:**
- **Ingresos:** $3,122,000
- **Gastos:** $2,883,400
- **Ahorro mensual:** $238,600 (esto es lo que te queda después de cubrir tus gastos)

Este ahorro mensual es un buen punto de partida, pero siempre hay margen para mejorar.

### 2. **Crea un presupuesto detallado:**
- Clasifica tus gastos en categorías (vivienda, transporte, alimentación, ocio, etc.).
- Identifica áreas donde puedas reducir gastos.

### 3. **Establece metas financieras:**
- **Corto plazo:** Ahorrar para un fondo de emergencia (3-6 meses de gastos).
- **Mediano plazo:** Ahorrar para una inversión, como un apartamento o un negocio.
- **Largo plazo:** Planificar para la jubilación o la educación de tus hijos.`

export default function Resume() {
  const {
    data: accounts,
    loading: loadingAccounts,
    setData: setAccounts,
  } = useAccounts();
  const {
    expenses,
    loading: loadingExpenses,
    setExpenses,
    deleteExpense,
  } = useExpenses();
  const { data: incomes, deleteIncome, setData: setIncomes } = useIncomes();
  const [mesActual, setMesActual] = useState(0);
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());
  const [tour, setTour] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const currentDate = new Date();
  const monthName = monthNames[mesActual];

  useEffect(() => {
    setMesActual(currentDate.getMonth());
  }, []);

  /**
   * Combines expenses and incomes into a single transactions array
   */
  const transactions = [...expenses, ...incomes];

  /**
   * Filters transactions for the current month and year, and sorts them by date
   */
  const transactionsFilterForDate = transactions
    .filter((gasto) => {
      if (!gasto.date) return false;
      const [year, month] = gasto.date.split("-");
      return parseInt(year) === anioActual && parseInt(month) - 1 === mesActual;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  const totalMoney = (type: string) => {
    return transactions.filter((item: any) => type === 'expense' ? item.type === 'expense' : item.type !== 'expense')
    .reduce((acc: any, item: any) => acc + parseFloat(item.value), 0);
  }

  return (
    <>
      <Head />
      <section className="w-full md:w-[100%] px-5 mt-5 md:px-10">
        <div className="flex justify-between w-full">
          <h1 className="text-md md:text-2xl font-semibold text-start text-purple-500 pb-2 animate-fade-in flex items-center">
            Balance de {monthName}
            <Button className="text-white" onClick={() => setTour(true)}>
              <CircleHelp />
            </Button>
          </h1>
          <div className="relative">
            <button
                onClick={() => {
                  setShowAI(!showAI);
                }}
                className={`${
                  showAI
                    ? 'group'
                    : 'bg-gradient-to-r from-purple-600 rounded-md to-blue-500 animate-gradient-xy text-white'
                } flex items-center gap-2 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10`}
              >
                <div className="relative group">
                {showAI && (
                  // Borde animado con gradiente para cuando showAI es true
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition  animate-pulse animate-gradient-xy"></div>
                )}
                <div className={`${showAI && 'bg-background'} border border-transparent text-white rounded-md relative flex items-center gap-2 p-2 text-white text-sm`}>
                  <AIIcon /> {showAI ? 'Cerrar consejo' : 'Consejo de AI'}
                </div>
                </div>
              </button>
              {showAI && (
                  <div
                    className="absolute left-1/4 h-[45%] w-1 bg-gradient-to-b from-purple-600 via-pink-500 to-blue-500 blur-xs opacity-75 animate-pulse animate-gradient-xy"
                    style={{top: '80%'}}
                  ></div>
                )}
          </div>

          <div className="text-end">
            <button
              className="border-gray-300 border rounded-md mr-3 hover:bg-[var(--color-usage)] transition-colors"
              title="Mes anterior"
              onClick={() => cambiarMes("anterior")}
            >
              <BackIcon />
            </button>
            <button
              className="border-gray-300 border rounded-md hover:bg-[var(--color-usage)] transition-colors"
              title="Mes siguiente"
              onClick={() => cambiarMes("siguiente")}
            >
              <NextIcon />
            </button>
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
          {showAI ? (
            <AIResponse totalMoney={totalMoney}  />
          ) : (
            <WrapperTable
              transactionsFilterForDate={transactionsFilterForDate}
              loadingExpenses={loadingExpenses}
              monthCurrent={mesActual}
              deleteIncome={deleteIncome}
              setAccounts={setAccounts}
              accounts={accounts}
              deleteExpense={deleteExpense}
            />
          )}
        </div>
      </section>
      <Tour runTour={tour} />
    </>
  );
}
