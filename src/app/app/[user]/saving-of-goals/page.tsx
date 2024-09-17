'use client'

import Head from '@/app/components/Head/Head'
import SavingGoalCard from './components/saving-goal-card'
import ModalNewSavingGoal from './modal/modal-new-saving-goal'
import useSavingGoals from './hooks/useSavingGoals'
import SkeletonAccount from '../accounts/loading'
import Image from 'next/image'
import Gift from '@/../public/empty.gif'
import OpenButton from '../accounts/OpenButton/OpenButton'

export default function SavingGoals() {
  const { data, loading, setRefresh, setData } = useSavingGoals()

  return (
    <>
      <Head />
      <section>
        <div className="flex items-center justify-center pb-3">
          <h1 className="text-2xl font-medium text-center text-purple-500">
            Metas de Ahorro
          </h1>
          <OpenButton />
        </div>
        <div className="flex gap-3 items-center max-w-[800px] m-auto justify-center">
          {loading ? (
            <></>
          ) : data.length === 0 ? (
            <div className="flex flex-col gap-3 items-center m-auto w-full">
              <Image
                src={Gift}
                alt="Sin items"
                className="rounded-md px-5 md:px-0"
                priority
              />
              <small className="opacity-50 italic font-medium text-white">
                ¡Aún no has registrado ninguna meta de ahorro! Comienza a crear
                tus objetivos financieros.
              </small>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="grid grid-cols-1 px-10 gap-5 py-5 md:grid-cols-3">
          {loading ? (
            <SkeletonAccount />
          ) : (
            <SavingGoalCard data={data} setData={setData} />
          )}
        </div>
      </section>
      <ModalNewSavingGoal refresh={setRefresh} />
    </>
  )
}
