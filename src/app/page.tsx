"use client";

import Devs from "./components/Devs";
import GoogleText from "./components/GoogleText";
import AnimationSnow from "./animations/Snow";
import Head from "./components/Head/Head";
import GridBento from "./components/GridBento/GridBento";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <Head />
      <main className="!w-full animate-fade-in ">
        <div className="animate-fade-in-down container max-w-[800px] m-auto">
          <h1 className="text-center mb-16 [font-size:5.5rem] [line-height:1] font-bold">
            <span className="text-gradient">Flow Finance</span>
          </h1>
          <p className="text-start text-secondary font-medium text-xl px-10 md:p-0">
            <b>Necesitas esto!</b> Para administrar tus finanzas de manera
            efectiva, es importante llevar un seguimiento detallado de tus{" "}
            <b className="text-purple-300">
              activos, ingresos, ahorros, inversiones y restarles tus pasivos,
              como deudas y gastos.
            </b>{" "}
            Esto te permitirá determinar en qué estás gastando y dónde puedes
            recortar gastos, así como a dónde deben ir tus ingresos.
            <br />
            <br />
            <span>Animate.</span>
            Guarda tu pre-registro con <GoogleText />
          </p>
        </div>
        <section className="py-10 md:py-18 animate-fade-in-down m-auto w-full">
          {session && (
            <div>
              <p className="text-center text-sm font-bold text-palette">
                Gracias por pre-registrarte y confiar en nuestra App, te
                estaremos notificando cuando estemos listos.
              </p>
            </div>
          )}
        </section>
        <Devs />
        <div className="max-w-[800px] m-auto text-center mt-10 md:mt-40 ">
          <div className="[line-height:1.5rem] [letter-spacing:.125rem] text-palette text-sm">
            ¿Cómo funciona?
          </div>
          <div>
            <h2 className="text-3xl [letter-spacing:-.0625rem] text-purple-300 font-semibold [line-height:3rem]">
              Un gestor, muchas funciones
            </h2>
          </div>
        </div>
        <GridBento />
      </main>
      <AnimationSnow />
    </>
  );
}
