"use client";

import Head from "@/app/components/Head/Head";
import SkeletonTitle from "@/app/components/LoaderTitle/LoaderTitle";
import Card from "./Card";
import ModalNewAccount from "./Modal/ModalNewAccount";
import useAccounts from "./hooks/useAccounts";
import SkeletonAccount from "./loading";
import Image from "next/image";
import Gift from '@/../public/empty.gif'


export default function Accounts() {
  const { data, loading, setRefresh, setData } = useAccounts();

  return (
    <>
      <Head />
      <section>
        <div className="flex gap-3 items-center max-w-[800px] m-auto justify-center">
          {loading ? <div className="w-full"><SkeletonTitle /></div> : data.length >= 1 ? (
            <h3 className="text-center font-bold text-white text-xl md:text-2xl">
              Tienes <span className='text-purple-300'>{data.length}</span> cuentas registradas.
            </h3>
          ) : (
            <h3 className="text-center font-bold text-white text-2xl">
              Ingresa tus cuentas de{" "}
              <span className="text-purple-300">activos.</span>
            </h3>
          )}
        </div>
          {
            loading ? <></> :
            data.length === 0
              ? (
                <div className="flex flex-col gap-3 items-center m-auto w-full py-5">
                  <Image src={Gift} alt='Sin items' className="rounded-md px-5 md:px-0" priority />
                  <small className="opacity-50 italic font-medium text-white">
                    No tienes nada registrado aún!
                  </small>
                </div>
                )
            : <></>
          }
        <div className="grid grid-cols-1 px-10 gap-5 py-5 md:grid-cols-4">
          {loading ? <SkeletonAccount /> : <Card data={data} setData={setData} />}
        </div>
      </section>
      <ModalNewAccount refresh={setRefresh}/>
    </>
  );
}
