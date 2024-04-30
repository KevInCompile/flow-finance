"use client";

import Gift from "@/../public/forbbiden.gif";
import Image from "next/image";
import GoogleIcon from "../icons/GoogleIcon";
import { signIn } from "next-auth/react";

export default function Forbbiden() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-10 py-10">
      <h1 className="text-white font-semibold text-xl">
        Pa pancla, inicia sesión para poder entrar a tu perfil.
      </h1>
      <small className="opacity-50 italic font-medium text-white">
        No intentes cosas extrañas
      </small>
      <button
        className="bg-secondary text-sm font-medium bg-blur rounded-xl p-2 px-5 text-primary hover:opacity-80 transition-all flex items-center gap-2 m-auto md:text-sm"
        onClick={() => signIn("google")}
      >
        <GoogleIcon className="w-5 h-5" />
        Iniciar sesión
      </button>
      <Image
        src={Gift}
        alt="Sin autorizacion"
        className="rounded-md"
        priority
      />
    </div>
  );
}
