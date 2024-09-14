'use client'

import Devs from './components/Devs'
import AnimationSnow from './animations/Snow'
import Head from './components/Head/Head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoaderPage from './components/LoaderPage/LoaderPage'
import GridBento from './components/GridBento/GridBento'
import example from '@/../../public/example.png'
import Image from 'next/image'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading')
    return (
      <div className="grid place-items-center h-[80vh] mr-24">
        <LoaderPage />
      </div>
    )
  if (status === 'authenticated')
    return router.push(`/app/${session.user?.name}/profile`)

  return (
    <>
      <Head />
      <main className="!w-full animate-fade-in">
        <div className="animate-fade-in-down pt-24 md:pt-30 relative overflow-hidden px-10 md:px-20 min-h-[100vh]">
          <div className="hidden md:block md:absolute bottom-0 h-[500px] w-[500px] top-[200px] right-[-95%] md:w-[700px] md:h-[700px] md:right-[-60%] md:top-[-100px] lg:right-[-80%] lg:top-[-120px] lg:h-[1300px] lg:w-[1300px] xl:w-[1500px] xl:h-[1500px] xl:right-[-60%] rounded-full bg-[radial-gradient(circle_farthest-side,rgb(168,85,247,.70),rgba(255,255,255,0))]"></div>
          <div className="max-w-[42rem]">
            <h1 className="mb-10 [font-size:5.2rem] [line-height:1] font-bold">
              <span className="bg-gradient">Flow Finance</span>
            </h1>
            <p className="text-start text-secondary font-medium text-2xl md:p-0 opacity-70">
              Track your assets, income, savings, investments, and deduct your
              liabilities to understand your spending, identify areas to cut
              costs, and allocate your income effectively.
            </p>
          </div>
          <Image
            src={example}
            alt="example"
            className="mt-10 rounded-xl border relative z-10"
          />
        </div>
        <div className="text-center mt-10 md:mt-40 md:px-20 px-6">
          <div className="[line-height:1.5rem] [letter-spacing:.125rem] text-palette text-sm">
            How it works?
          </div>
          <div>
            <h2 className="text-3xl [letter-spacing:-.0625rem] text-purple-500 font-semibold [line-height:3rem]">
              One manager, many functions
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
