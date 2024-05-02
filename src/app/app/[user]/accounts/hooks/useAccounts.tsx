"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AccountModel } from "../models/account.model";
import accountsFetch from "../services/AccountsFetch";

export default function useAccounts() {
  const [data, setData] = useState<AccountModel[]>([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    const getData = async (user: string) => {
      setLoading(true);
      try{
        const [error, result] = await accountsFetch(user);
        if (error) return toast(error);
        setData(result);
        setLoading(false);
      }catch(e){
      }finally{
        setLoading(false);
      }
    };
    getData(params.user as string);
  }, [params.user]);

  return { data, loading };
}
