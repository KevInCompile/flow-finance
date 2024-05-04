"use client";

import Head from "@/app/components/Head/Head";
import { useRouter } from "next/navigation";
import OpenButton from "../accounts/OpenButton/OpenButton";
import BentoInformation from "./components/BentoInformation/BentoInformation";
import ModalNewExpense from "./components/ModalNewExpense";
import TableExpenses from "./components/TableExpenses/TableExpenses";

export default function Resume() {
  const router = useRouter()
  return (
    <>
      <Head />
      <div>
        <section className="w-full md:w-[100%] px-10 mt-5">
          <h1 className='text-2xl font-medium text-start text-[var(--color-usage)] pb-2'>Resume</h1>
          <div className='grid grid-cols-2 mt-3 gap-5'>
            <BentoInformation />
          </div>
          <div className="mt-10">
            <div className="flex gap-3 items-center">
              <h3 className="text-2xl text-[var(--color-usage)] font-medium">Registro de gastos</h3>
              <OpenButton />
            </div>
            <TableExpenses />
          </div>
        </section>
        <ModalNewExpense router={router} />
      </div>
    </>
  );
}
