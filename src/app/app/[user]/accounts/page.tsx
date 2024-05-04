"use client";

import Head from "@/app/components/Head/Head";
import SkeletonTitle from "@/app/components/LoaderTitle/LoaderTitle";
import Card from "./Card";
import ModalNewAccount from "./Modal/ModalNewAccount";
import OpenButton from "./OpenButton/OpenButton";
import useAccounts from "./hooks/useAccounts";
import SkeletonAccount from "./loading";

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
          {!loading && <OpenButton />}
        </div>
        <div className="grid grid-cols-1 px-10 gap-5 py-5 md:grid-cols-4">
          {loading ? <SkeletonAccount /> : <Card data={data} setData={setData} />}
        </div>
      </section>
      <ModalNewAccount refresh={setRefresh}/>
    </>
  );
}
