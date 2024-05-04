"use client";

import Head from "@/app/components/Head/Head";
import useModal from "@/app/components/Modal/useModal";
import ModalNewExpense from "./components/ModalNewExpense";
import BentoInformation from "./components/BentoInformation/BentoInformation";
import OpenButton from "../accounts/OpenButton/OpenButton";

export default function Resume() {
  const { handleShowModal } = useModal();
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
            <header className="uppercase text-white border-b pb-5 mt-5 text-sm grid grid-cols-4">
              <span>Categoria</span>
              <span>Descripción</span>
              <span>Fecha</span>
              <span>Valor</span>
            </header>
            <div className="py-5 grid grid-cols-4 border-b">
            <div className="flex gap-2 items-center text-white">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-chef-hat"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="var(--color-palette)"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 3c1.918 0 3.52 1.35 3.91 3.151a4 4 0 0 1 2.09 7.723l0 7.126h-12v-7.126a4 4 0 1 1 2.092 -7.723a4 4 0 0 1 3.908 -3.151z" />
                  <path d="M6.161 17.009l11.839 -.009" />
                </svg>
                <span>Comida</span>
              </div>
              <p className="text-white opacity-70">Hamburguesa</p>
              <span className='text-white opacity-70'>17 de Febrero</span>
              <span className='text-palette font-medium'>$35,000</span>
            </div>
          </div>
          {/* <div className="flex justify-center py-5"></div>
          <h2 className="text-3xl text-palette font-bold">
            $ {data.reduce((acc, item) => acc + parseInt(item.value), 0).toLocaleString()}
          </h2>
          <DateRangeExpense />
        </section>
        <div className="w-full bg-[#242424] h-[300px] container mx-auto relative z-8 rounded-[0_0_20px_20px] md:w-[70%]">
          <button
            onClick={handleShowModal}
            className="absolute right-0 top-[-1.5em] bg-palette rounded-full w-12 h-12 z-10"
          >
            +
          </button>
          <header className="font-bold text-white px-16 md:px-36 py-3 flex opacity-90 border-gray-600 border-b justify-between">
            <span>Valor</span>
            <span>Categoria</span>
          </header>
          <div className="px-16 py-3 flex justify-between items-center md:px-36 text-white">
            <span className="">$ 4.000</span>
            <div className="flex flex-col gap-2 items-center">
              <div className="flex gap-2 items-center">
                <span>Comida</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-chef-hat"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="var(--color-palette)"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 3c1.918 0 3.52 1.35 3.91 3.151a4 4 0 0 1 2.09 7.723l0 7.126h-12v-7.126a4 4 0 1 1 2.092 -7.723a4 4 0 0 1 3.908 -3.151z" />
                  <path d="M6.161 17.009l11.839 -.009" />
                </svg>
              </div>
              <i className="opacity-50 text-sm">Hamburguesa</i>
            </div>
          </div>
        </div> */}
        </section>
        <ModalNewExpense />
      </div>
    </>
  );
}
