"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AccountModel } from "../models/account.model";
import accountsFetch from "../services/AccountsFetch";

export default function useAccounts() {
  const [data, setData] = useState<AccountModel[]>([]);
  const router = useRouter()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const params = useParams();

  useEffect(() => {
    const getData = async (user: string) => {
      try{
        const [error, result] = await accountsFetch(user);
        if (error) return toast.error(error);
        setData(result);
        setLoading(false);
      }catch(e){
      }finally{
        setLoading(false);
      }
    };
    getData(params.user as string);

    return () => setRefresh(false)
  }, [refresh]);

  return { data, loading, setRefresh, setData, router };
}
