"use client";

import Devs from "./components/Devs";
import GoogleText from "./components/GoogleText";
import AnimationSnow from "./animations/Snow";
import Head from "./components/Head/Head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoaderPage from "./components/LoaderPage/LoaderPage";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div className="grid place-items-center h-[80vh] mr-24"><LoaderPage /></div>;
  if (status === "authenticated") return router.push(`/app/${session.user?.name}/resume`);

  return (
    <>
    <Head />
    <div className="relative h-full bg-transparent">
      <div className="absolute bottom-0 left-[0%] right-0 top-[-10%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(220,172,10,.25),rgba(255,255,255,0))]"></div><div className="absolute bottom-0 right-[0%] top-[-10%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(218,186,255,.45),rgba(255,255,255,0))]"></div></div>
      <main className="!w-full animate-fade-in ">
        <div className="animate-fade-in-down container m-auto px-10">
          <h1 className="text-center mb-16 [font-size:5.5rem] [line-height:1] font-bold">
            <span className="bg-gradient">Flow Finance</span>
          </h1>
          <p className="text-start text-secondary font-medium text-xl md:p-0">
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
            Pronto habrá más detalles de la app...
          </div>
        </div>
          { /*  <div className="[line-height:1.5rem] [letter-spacing:.125rem] text-palette text-sm">
            ¿Cómo funciona?
          </div>
          <div>
            <h2 className="text-3xl [letter-spacing:-.0625rem] text-purple-300 font-semibold [line-height:3rem]">
              Un gestor, muchas funciones
            </h2>
          </div>
        </div>
        <GridBento />
        */ }
        <AnimationSnow />
      </main>
    </>
  );
}
