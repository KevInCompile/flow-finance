'use client'

import Head from "@/app/components/Head/Head";
import OpenButton from "../accounts/OpenButton/OpenButton";
import ModalNewDebt from "./Modal/ModalNewDebt";
import useDebts from "./hooks/useDebts";
import CardDebt from "./components/card/CardDebt";
import Gift from '@/../public/empty.gif'
import Image from "next/image";
import LoaderPage from "@/app/components/LoaderPage/LoaderPage";

export default function Debts () {
  const {data, loading, setRefresh, setData} = useDebts()

  return(
    <>
      <Head />
      <div className="flex items-center justify-center pb-3">
       <h1 className='text-2xl font-medium text-center text-[var(--color-usage)]'>Deudas</h1>
       <OpenButton />
      </div>
      {
        loading ? <></> :
        data.length === 0
          ? (
            <div className="flex flex-col gap-3 items-center m-auto w-full">
              <Image src={Gift} alt='Sin items' className="rounded-md px-5 md:px-0" priority />
              <small className="opacity-50 italic font-medium text-white">
                No tienes nada registrado aún!
              </small>
            </div>
            )
        : <></>
      }
      <section className="px-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 relative">
        {
          loading
            ? <div className="absolute grid place-items-center w-[80vw] h-[50vh] m-auto text-center"><LoaderPage /></div>
            :
            data.map((item) => {
              return (
                <div key={item.id}>
                  <CardDebt fullData={data} data={item} setData={setData} setRefresh={setRefresh} />
                </div>
              )
            })
        }
      </section>
      <ModalNewDebt refresh={setRefresh} />
    </>
  )
}
