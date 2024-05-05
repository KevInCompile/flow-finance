"use client";

import Head from "@/app/components/Head/Head";
import SkeletonTable from "@/app/loaders/SkeletonTable";
import OpenButton from "../accounts/OpenButton/OpenButton";
import useAccounts from "../accounts/hooks/useAccounts";
import BentoInformation from "./components/BentoInformation/BentoInformation";
import ModalNewExpense from "./components/ModalNewExpense";
import TableExpenses from "./components/TableExpenses/TableExpenses";
import useExpenses from "./hooks/useExpenses";

export default function Resume() {
  const {data, loading, setRefresh} = useAccounts()
  const {expenses, loading: loadingExpenses, setRefresh: setRefreshExpenses} = useExpenses()

  const refreshData = () => {
    setRefresh(true)
    setRefreshExpenses(true)
  }
  
  return (
    <>
      <Head />
      <div>
        <section className="w-full md:w-[100%] px-10 mt-5">
          <h1 className='text-2xl font-medium text-start text-[var(--color-usage)] pb-2'>Resume</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 mt-3 gap-5'>
            <BentoInformation data={data} loading={loading}/>
          </div>
          <div className="mt-10">
            <div className="flex gap-3 items-center">
              <h3 className="text-2xl text-[var(--color-usage)] font-medium">Registro de gastos</h3>
              <OpenButton />
            </div>
            {
              loadingExpenses ? <SkeletonTable /> : <TableExpenses data={expenses} refresh={refreshData} />
            }
            
          </div>
        </section>
        <ModalNewExpense refresh={refreshData} />
      </div>
    </>
  );
}
