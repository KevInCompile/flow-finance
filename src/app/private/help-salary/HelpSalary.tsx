"use client";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { formatCurrency } from "../resume/utils/formatPrice";
import "./help-salary.css";
import CirclePercentage from "./components/circle";

export default function HelpSalary() {
  const value = useRef<string>("");

  const [salaryDivide, setSalaryDivide] = useState({
    fifty: 0,
    thirty: 0,
    twenty: 0,
  });

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    value.current = e.target.value;
  };

  const calculate = () => {
    const parseNumber = parseInt(value.current);
    const fifty = parseNumber * 0.5;
    const thirty = parseNumber * 0.3;
    const twenty = parseNumber * 0.2;
    setSalaryDivide({ fifty, thirty, twenty });
  };

  return (
    <main className="px-5 md:px-10 py-5">
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          onChange={handleValue}
          placeholder="Write your salary"
        />
        <button
          onClick={calculate}
          className="bg-purple-500 text-white font-medium w-auto rounded-xl p-2 px-5 hover:opacity-50 ease-out transition flex items-center gap-2 text-sm"
        >
          Go
        </button>
      </div>
      {salaryDivide.fifty !== 0 && (
        <section className="grid grid-cols-3 gap-10">
          <article>
            <CirclePercentage percentage={50} color="green" />
            <p>
              Los{" "}
              <b className="text-green-600">
                {formatCurrency(salaryDivide.fifty)}
              </b>{" "}
              se usaria para tus gastos escenciales como:{" "}
              <b>
                Comida, vivienda, salud, servicios publicos e incluir el pago de
                las deudas
              </b>
            </p>
          </article>
          <article>
            <CirclePercentage percentage={30} color="cyan" />
            <p>
              Los{" "}
              <b className="text-cyan-600">
                {formatCurrency(salaryDivide.thirty)}
              </b>{" "}
              se usarias en gastos no escenciales como:{" "}
              <b>
                Gustos, deseos, vacaciones, salidas a comer, entretenimiento
              </b>
            </p>
          </article>
          <article>
            <CirclePercentage percentage={20} color="yellow" />
            <p>
              Los{" "}
              <b className="text-yellow-600">
                {formatCurrency(salaryDivide.twenty)}
              </b>{" "}
              se usaria para <b>ahorrar e invertir</b> y también para tu fondo
              de emergencia
            </p>
          </article>
        </section>
      )}
    </main>
  );
}
