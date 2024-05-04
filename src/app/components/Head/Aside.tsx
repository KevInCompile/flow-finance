import ActivityIcon from "@/app/icons/IconsAside/ActivityIcon";
import CloseMenuIcon from "@/app/icons/IconsAside/CloseMenuIcon";
import CoinIcon from "@/app/icons/IconsAside/CoinIcon";
import CreditCardRefundIcon from "@/app/icons/IconsAside/CreditCardRefundIcon";
import ExchangeIcon from "@/app/icons/IconsAside/ExchangeIcon";
import RecepitIcon from "@/app/icons/IconsAside/RecepitIcon";
import { FormatDate } from "@/app/utils/FormatDate";

import Image from "next/image";

import "./assets/aside.css";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Aside() {
  const { data: session } = useSession();
  const avatar = session?.user?.image as string;
  return (
    <aside className="h-full w-full absolute top-0 z-10 backdrop-blur-sm -left-full aside">
      <div className="bg-[#242424]/100 h-full w-80 -left-80 relative transition-all duration-300 ease-in menu-aside border-r">
        <button
          id="close"
          className="absolute top-0 mt-2 right-2 z-10 hover:scale-110 trasition"
        >
          <label htmlFor="check" className="cursor-pointer">
            <input type="checkbox" id="check" />
            <CloseMenuIcon width="30" />
          </label>
        </button>
        <div className="flex items-center justify-start px-2 py-5 gap-2">
          <div className="flex items-center justify-center w-14 h-14 border-2 border-[var(--color-palette)] p-1 rounded-full">
            <Image
              src={avatar}
              className="rounded-full w-12 h-12 p-1"
              loading="lazy"
              decoding="async"
              alt="Avatar"
              width={30}
              height={30}
            />
          </div>
          <span className="text-purple-300 text-xl font-bold">
            {session?.user?.name}
          </span>
        </div>
        <ul className="text-lg text-white flex flex-col gap-3">
          <Link
            href={`/app/${session?.user?.name}/resume`}
            className="bg-transparent"
          >
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <ActivityIcon />
              <span>Resumen</span>
            </li>
          </Link>
          <Link
            href={`/app/${session?.user?.name}/accounts`}
            className="bg-transparent"
          >
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <CoinIcon />
              <span>Cuentas</span>
            </li>
          </Link>
          <Link
            href={`/app/${session?.user?.name}/debts`}
            className="bg-transparent"
          >
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <CreditCardRefundIcon />
              <span>Deudas</span>
            </li>
          </Link>
          <Link href="#" className="bg-transparent">
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <RecepitIcon />
              <span>Configurar pagos habituales</span>
            </li>
          </Link>
          <Link href="#" className="bg-transparent">
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <ExchangeIcon />
              <span>
                Divisas ~{" "}
                <span className="text-palette text-sm">Conversor</span>
              </span>
            </li>
          </Link>
          <li className="absolute bottom-0 w-full justify-center opacity-50 text-sm">
            {FormatDate(session?.expires ?? "")}
          </li>
        </ul>
        <h1 className="w-full text-center opacity-50 italic text-white my-10">
          Pronto se habilitarán las opciones
        </h1>
      </div>
    </aside>
  );
}
