'use client'

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import debtsFetch from "../services/DebtsFetch";
import { Debt } from "../models/debts.models";




export default function useDebts () {
  const [data, setData] = useState<Debt[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const params = useParams();

  useEffect(() => {
    const getData = async (user: string) => {
      try{
        const [error, result] = await debtsFetch(user);
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
  }, [params.user, refresh]);

  return { data, loading, setRefresh, setData, router };
}
