import { useState } from "react";
import { toast } from "sonner";
import createPayment from "./services/createPayment";
import Button from "@/app/components/Button/Button";
import { DollarSign, CreditCard, PiggyBank } from "lucide-react";

interface Props {
  debtID: number;
  setIsPay: React.Dispatch<boolean>;
  monthlyPayment?: number;
}

export default function FormAbono(props: Props) {
  const { debtID, setIsPay, monthlyPayment = 0 } = props;

  const [data, setData] = useState({
    paymentType: "Pago de cuota",
    payValue: monthlyPayment > 0 ? monthlyPayment : 0,
  });

  const paymentTypes = [
    { value: "Pago de cuota", label: "Pago de cuota", icon: <CreditCard className="h-4 w-4" />, description: "Pago completo de la cuota mensual" },
    { value: "Abono a capital", label: "Abono a capital", icon: <PiggyBank className="h-4 w-4" />, description: "Pago parcial que reduce el capital" },
    { value: "Pago anticipado", label: "Pago anticipado", icon: <DollarSign className="h-4 w-4" />, description: "Pago de varias cuotas por adelantado" },
    { value: "Abono extra", label: "Abono extra", icon: <DollarSign className="h-4 w-4" />, description: "Pago adicional a la cuota regular" },
  ];

  const [loading, setLoading] = useState<boolean>(false);

  const createAbono = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const [error] = await createPayment({
      debtID,
      paymentType: data.paymentType,
      payValue: data.payValue,
    });
    if (error) {
      toast.warning("Error al hacer el abono...");
    } else {
      setData({ ...data, payValue: 0 });
      setIsPay(false);
      toast.success("Abono registrado!");
    }
    setLoading(false);
  };

  // async function createAbono() {

  // }

  const formatedValue = (value: string) => {
    setData({
      ...data,
      payValue: Number(value),
    });
  };

  const handlePaymentTypeChange = (type: string) => {
    setData({
      ...data,
      paymentType: type,
      // Si selecciona "Pago de cuota" y hay un monto mensual, establecerlo automáticamente
      payValue: type === "Pago de cuota" && monthlyPayment > 0 ? monthlyPayment : data.payValue
    });
  };

  const handleQuickAmount = (amount: number) => {
    setData({
      ...data,
      payValue: amount,
    });
  };

  return (
    <form id="form" onSubmit={createAbono} className="space-y-4">
      <div>
        <label className="block text-gray-300 text-sm font-medium pb-2">
          Tipo de pago
        </label>
        <div className="grid grid-cols-2 gap-2">
          {paymentTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handlePaymentTypeChange(type.value)}
              className={`p-3 rounded-lg border transition-all ${
                data.paymentType === type.value
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${
                  data.paymentType === type.value ? "bg-blue-500/20" : "bg-gray-700"
                }`}>
                  {type.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs opacity-75">{type.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium pb-2">
          Monto del pago
        </label>

        {monthlyPayment > 0 && data.paymentType === "Pago de cuota" && (
          <div className="mb-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-400">Cuota mensual calculada:</span>
              <span className="font-bold text-white">${monthlyPayment.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Este monto incluye capital + intereses de la cuota actual
            </p>
          </div>
        )}

        <div className="flex gap-2 mb-3">
          {monthlyPayment > 0 && (
            <button
              type="button"
              onClick={() => handleQuickAmount(monthlyPayment)}
              className="flex-1 py-2 px-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
            >
              Cuota (${monthlyPayment.toLocaleString()})
            </button>
          )}
          <button
            type="button"
            onClick={() => handleQuickAmount(monthlyPayment > 0 ? monthlyPayment * 2 : 0)}
            className="flex-1 py-2 px-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm font-medium transition-colors"
          >
            Doble cuota
          </button>
          <button
            type="button"
            onClick={() => handleQuickAmount(Math.round(monthlyPayment > 0 ? monthlyPayment * 0.5 : 0))}
            className="flex-1 py-2 px-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm font-medium transition-colors"
          >
            Mitad
          </button>
        </div>

        <input
          type="number"
          className="bg-gray-800 border border-gray-700 w-full p-3 rounded-lg text-white text-lg font-medium"
          name="payValue"
          onChange={(e) => formatedValue(e.target.value)}
          value={data.payValue}
          autoComplete="off"
          required
          min="1"
          step="0.01"
          placeholder="Ingrese el monto"
        />

        {data.paymentType === "Pago de cuota" && monthlyPayment > 0 && (
          <div className="mt-2">
            {data.payValue < monthlyPayment && data.payValue > 0 ? (
              <p className="text-sm text-yellow-500">
                ⚠️ El monto es menor a la cuota mensual (${monthlyPayment.toLocaleString()}). Se registrará como abono parcial.
              </p>
            ) : data.payValue > monthlyPayment ? (
              <p className="text-sm text-green-500">
                ✅ El excedente se aplicará como abono a capital.
              </p>
            ) : null}
          </div>
        )}
      </div>

      <div className="pt-2">
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-lg font-medium text-base"
          type="submit"
          text={`Registrar ${data.paymentType === "Pago de cuota" ? "cuota" : "pago"}`}
          isLoading={loading}
        />
        <p className="text-center text-xs text-gray-500 mt-2">
          {data.paymentType === "Pago de cuota"
            ? "Este pago reducirá tanto capital como intereses según la tabla de amortización"
            : data.paymentType === "Abono a capital"
            ? "Este pago se aplicará directamente al capital, reduciendo el saldo pendiente"
            : "El pago se distribuirá según el tipo seleccionado"}
        </p>
      </div>
    </form>
  );
}
