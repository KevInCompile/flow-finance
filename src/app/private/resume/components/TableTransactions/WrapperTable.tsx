'use client'

import { useEffect, useState } from "react";
import TableTransactions from "./TableTransactions";
import SkeletonTable from "@/app/loaders/SkeletonTable";
import { Search } from "lucide-react";

interface WrapperTableProps {
  loadingExpenses: boolean;
  transactionsFilterForDate: any[];
  setAccounts: any;
  accounts: any[];
  deleteExpense: any;
  monthCurrent: any;
  deleteIncome: any;
}

export default function WrapperTable({ transactionsFilterForDate, loadingExpenses, monthCurrent, deleteIncome, deleteExpense, setAccounts, accounts }: WrapperTableProps) {

  const [isDataAgruped, setIsDataAgruped] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactionsFilterForDate.filter(
    (transaction) => {
      if (searchTerm === "") return true;
      if (isDataAgruped) {
        return (
          transaction?.categoryname
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ?? false
        );
      } else {
        return (
          transaction?.description
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ?? false
        );
      }
    },
  );

  const handleAgruped = (e: any) => {
    const value = e.target.checked;
    window.localStorage.setItem("isAgruped", value);
    setIsDataAgruped(value);
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const local = window.localStorage.getItem("isAgruped") as string;
    if (local === "true") return setIsDataAgruped(true);
    return setIsDataAgruped(false);
  }, []);


  return (
    <div className="rounded-lg bg-[#191919] shadow-lg">
      <div className="flex flex-row gap-5 justify-between p-4">
        <div>
          <div className="flex flex-row gap-3 items-center">
            <h1 className="text-purple-400">Transacciones agrupadas</h1>
            <label className="switch" title="Agruped">
              <input
                type="checkbox"
                id="toggle-switch"
                onChange={handleAgruped}
                checked={isDataAgruped}
              />
              <span className="slider"></span>
            </label>
          </div>
          <small>Tu historial de transacciones</small>
        </div>
        <div className="flex gap-3 items-center">
          <div
            className={
              isSearching ? "relative w-full" : "relative w-10 h-10"
            }
          >
            <input
              type="text"
              placeholder={
                isDataAgruped
                  ? "Search by category"
                  : "Search by description"
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`border-[1px] rounded-xl border-white px-2 h-10  bg-transparent text-white transition-all duration-300 ${
                isSearching ? "w-full opacity-100" : "w-0 opacity-0"
              }`}
            />
            <button
              className={`border-[1px] rounded-xl border-gray-700 p-2 h-10 w-10 search absolute inset-0 transition-all duration-300 ${
                isSearching ? "opacity-0" : "opacity-100"
              }`}
              onClick={toggleSearch}
            >
              <Search />
            </button>
          </div>
        </div>
      </div>
      {loadingExpenses ? (
        <SkeletonTable />
      ) : (
        <TableTransactions
          data={filteredTransactions}
          monthCurrent={monthCurrent}
          isAgruped={isDataAgruped}
          deleteIncome={deleteIncome}
          setAccounts={setAccounts}
          accounts={accounts}
          deleteExpense={deleteExpense}
        />
      )}

    </div>
  )
}
