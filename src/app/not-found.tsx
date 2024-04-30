import Head from "@/app/components/Head/Head";
import Gift from "@/../public/404.gif";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Head />
      <div className="w-full flex flex-col items-center gap-5">
        <Image src={Gift} alt="404" className="rounded-md" priority />
        <div className="font-semibold text-white">
          <span className="text-purple-300">Vaya! </span>
          <span>parece que estas perdido. </span>
          <Link className="text-palette hover:scale-105 transition" href="/">
            Vuelve aquí
          </Link>
        </div>
      </div>
    </>
  );
}
