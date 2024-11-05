"use client";

import LoaderPage from "@/app/components/LoaderPage/LoaderPage";
import useGetUser from "./hooks/useGetUser";
import ChooseCurrency from "../choose-currency/ChooseCurrency";
import Resume from "../resume/Resume";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ValidateUser() {
  const { currency, loading: loadingGetUser, setDataSaved } = useGetUser();
  const { status } = useSession();
  const router = useRouter();

  if (status !== "authenticated") return router.push(`/`);

  if (loadingGetUser)
    return (
      <div className="grid place-items-center h-[80vh] mr-24">
        <LoaderPage />
      </div>
    );
  if (currency === undefined)
    return <ChooseCurrency setDataSaved={setDataSaved} />;
  if (currency) {
    localStorage.setItem("userCurrency", currency);
    return <Resume />;
  }
}
