'use client'

import Devs from './components/Devs'
import AnimationSnow from './animations/Snow'
import Head from './components/Head/Head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoaderPage from './components/LoaderPage/LoaderPage'
import GridBento from './components/GridBento/GridBento'
import Image from 'next/image'
import AIIcon from './icons/AI-Icon'

export default function Home() {
  const { status } = useSession()
  const router = useRouter()

  if (status === 'loading')
    return (
      <div className="grid place-items-center h-[80vh] mr-24">
        <LoaderPage />
      </div>
    )
  if (status === 'authenticated') return router.push(`/private/profile`)

  return (
    <>
      <Head />
      <main className="!w-full animate-fade-in">
        <div className="animate-fade-in-down pt-24 md:pt-30 relative overflow-hidden px-10 md:px-20 min-h-[100vh]">
          <div className="hidden md:block md:absolute bottom-0 h-[500px] w-[500px] top-[200px] right-[-95%] md:w-[700px] md:h-[700px] md:right-[-60%] md:top-[-100px] lg:right-[-80%] lg:top-[-120px] lg:h-[1300px] lg:w-[1300px] xl:w-[1500px] xl:h-[1500px] xl:right-[-80%] rounded-full bg-[radial-gradient(circle_farthest-side,rgb(168,85,247,.70),rgba(255,255,255,0))]"></div>
          <div className="max-w-[42rem]">
            <h1 className="mb-10 [font-size:5.2rem] [line-height:1] font-bold">
              <span className="bg-gradient">Ghost Finance</span>
              <br />
            </h1>
            <p className='text-xl mb-10 bg-gradient-ai text-purple-500 flex gap-1 items-center'>
              Beta AI <span><AIIcon /></span> - Te dará consejos financieros segun tus registros.
            </p>
            <p className="text-start text-secondary font-medium text-2xl md:p-0 opacity-70">
              Controla tus activos, ingresos, ahorros, inversiones y deduce tus
              pasivos para entender tus gastos, identificar áreas para reducir
              costos, y asignar tus ingresos de manera efectiva.
            </p>
          </div>
          <Image
            src="/preview/preview.png"
            alt="example"
            width={1000}
            height={200}
            className="mt-10 rounded-xl border relative z-10"
            unoptimized
          />
        </div>
        <div className="text-center md:px-20 px-6">
          <div className="[line-height:1.5rem] [letter-spacing:.125rem] text-palette text-sm">
            ¿Cómo funciona?
          </div>
          <div>
            <h2 className="text-3xl [letter-spacing:-.0625rem] text-purple-500 font-semibold [line-height:3rem]">
              Un gestor, múltiples funciones
            </h2>
          </div>
          <GridBento />
        </div>
        <Devs />
        <AnimationSnow />
      </main>
    </>
  )
}
