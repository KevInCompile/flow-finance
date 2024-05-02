"use client";

import Head from "@/app/components/Head/Head";
import ModalNewAccount from "./Modal/ModalNewAccount";
import Card from "./Card";
import SkeletonAccount from "./loading";
import OpenButton from "./OpenButton/OpenButton";
import useAccounts from "./hooks/useAccounts";
import SkeletonTitle from "@/app/components/LoaderTitle/LoaderTitle";

export default function Accounts() {
  const { data, loading, setRefresh } = useAccounts();

  return (
    <>
      <Head />
      <section>
        <div className="flex gap-3 items-center max-w-[800px] m-auto justify-center">
          {loading ? <div className="w-full"><SkeletonTitle /></div> : data.length >= 1 ? (
            <h3 className="text-center font-bold text-white text-2xl">
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
        <div className="grid grid-cols-2 px-10 gap-5 py-5 md:grid-cols-6">
          {loading ? <SkeletonAccount /> : <Card data={data} />}
        </div>
      </section>
      <ModalNewAccount refresh={setRefresh}/>
    </>
  );
}
