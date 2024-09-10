'use client'

import { signIn, useSession, signOut } from 'next-auth/react'
import MenuIcon from '@/app/icons/MenuIcon'
import Aside from './Aside'
import GoogleIcon from '@/app/icons/GoogleIcon'

export default function Head() {
  const { data: session } = useSession()

  const handleSignIn = (provider: string) => {
    signIn(provider)
  }

  return (
    <nav className="flex justify-between p-5 px-10">
      <div className="flex items-center gap-2">
        {session ? (
          <div className="flex items-center gap-2">
            <input type="checkbox" id="check" className="z-10" />
            <Aside />
            <label htmlFor="check" className="cursor-pointer">
              <div id="active">
                <MenuIcon width="40" />
              </div>
            </label>
            <span className="hidden md:block font-bold text-secondary">
              Hello, {session?.user?.name?.split(' ')[0]}
            </span>
          </div>
        ) : (
          <div className="bg-[#DDDDDD] font-bold bg-blur rounded-xl p-2 px-5 text-black">v 0.8.5</div>
        )}
      </div>
      <div>
        <slot />
      </div>
      <div className="flex items-center gap-2">
        {!session ? (
          <button
            className="bg-[#DDDDDD] text-sm font-medium bg-blur rounded-xl p-2 px-5 text-black hover:opacity-80 transition-all flex items-center gap-2 m-auto md:text-sm"
            onClick={() => handleSignIn('google')}
          >
            <GoogleIcon className="w-5 h-5" />
            Iniciar sesión
          </button>
        ) : (
          <button
            className="bg-[var(--color-usage)] font-medium w-auto rounded-xl p-2 px-5 hover:opacity-50 ease-out transition flex items-center gap-2 text-black text-sm"
            onClick={() => signOut()}
          >
            <span>Cerrar sesión</span>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-logout"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="#000"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M9 12h12l-3 -3" />
                <path d="M18 15l3 -3" />
              </svg>
            </div>
          </button>
        )}
        {/* <ThemeToogle /> */}
      </div>
    </nav>
  )
}
