import ActivityIcon from "@/app/icons/IconsAside/ActivityIcon";
import CloseMenuIcon from "@/app/icons/IconsAside/CloseMenuIcon";
import CoinIcon from "@/app/icons/IconsAside/CoinIcon";
import CreditCardRefundIcon from "@/app/icons/IconsAside/CreditCardRefundIcon";
import { FormatDate } from "@/app/utils/FormatDate";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import "./assets/aside.css";
import SavingIcon from "@/app/icons/IconsAside/SavingIcon";
import BlogIcon from "@/app/icons/IconsAside/BlogIcon";
import { ChartBar, ChartBarStacked } from "lucide-react";

export default function Aside() {
  const { data: session } = useSession();
  const avatar = session?.user?.image as string;

  return (
    <aside className="h-full w-full absolute top-0 z-10 backdrop-blur-sm -left-full aside">
      <div className="bg-[#191919] h-full w-80 -left-80 relative transition-all duration-300 ease-in menu-aside border-r">
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
          <div className="flex items-center justify-center w-14 h-14 border-2 border-[var(--palette)] p-1 rounded-full">
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
          <span className="text-purple-500 text-xl font-bold">
            {session?.user?.name}
          </span>
        </div>
        <ul className="text-lg text-white flex flex-col gap-3">
          <Link href={`/private/profile`} className="bg-transparent">
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <ActivityIcon />
              <span>Resumen</span>
            </li>
          </Link>
          <Link href={`/private/accounts`} className="bg-transparent">
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <CoinIcon />
              <span>Cuentas</span>
            </li>
          </Link>
          <Link href={`/private/debts`} className="bg-transparent">
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <CreditCardRefundIcon />
              <span>Deudas</span>
            </li>
          </Link>
          <Link href={`/private/saving-goals`} className="bg-transparent">
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <SavingIcon />
              <span>Metas de ahorro</span>
            </li>
          </Link>
          <Link href={`/private/categories`} className="bg-transparent">
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <ChartBarStacked />
              <span>Categorías</span>
            </li>
          </Link>
          <Link href={`/private/blog`} className="bg-transparent">
            <li className="p-2 hover:pl-4 hover:bg-primary hover:text-yellow-500 transition-all border-gray-500">
              <BlogIcon />
              <span>Blog</span>
            </li>
          </Link>
          <li className="absolute bottom-0 w-full justify-center opacity-50 text-sm">
            {FormatDate(session?.expires ?? "")}
          </li>
        </ul>
      </div>
    </aside>
  );
}
