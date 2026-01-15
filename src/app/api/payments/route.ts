import { authMiddleware } from "../middleware/auth";
import {
  DELETE_PAYMENTS,
  INSERT_PAYMENTS,
  SELECT_PAYMENTS,
  UPDATE_FORMATT_PAYMENTS,
  UPDATE_PAYMENTS,
} from "./services/payments.service";
import { handleError } from "../utils/handleError";
import { handleSuccess } from "../utils/handleSuccess";
import { sql } from '@vercel/postgres'

// Función para calcular la distribución de capital e intereses para un pago
const calculatePaymentBreakdown = async (debtId: number, paymentAmount: number) => {
  // Obtener información de la deuda
  const debtResult = await sql`
    SELECT d.*, 
           COALESCE(SUM(p.capital_paid), 0) as total_capital_paid,
           COALESCE(SUM(p.interest_paid), 0) as total_interest_paid
    FROM debts d
    LEFT JOIN payments p ON d.id = p.debts_id
    WHERE d.id = ${debtId}
    GROUP BY d.id
  `

  if (debtResult.rows.length === 0) {
    throw new Error('Deuda no encontrada')
  }

  const debt = debtResult.rows[0]
  const principal = parseFloat(debt.total_amount) || 0
  const interestRate = parseFloat(debt.interest) || 0
  const totalCapitalPaid = parseFloat(debt.total_capital_paid) || 0
  const totalInterestPaid = parseFloat(debt.total_interest_paid) || 0
  
  // Calcular saldo pendiente de capital
  const remainingCapital = Math.max(0, principal - totalCapitalPaid)
  
  // Si no hay interés o el saldo de capital es 0, todo va a capital
  if (interestRate <= 0 || remainingCapital <= 0) {
    return {
      capitalPaid: paymentAmount,
      interestPaid: 0
    }
  }

  // Calcular interés acumulado hasta la fecha
  // Primero obtener la fecha del último pago o fecha de inicio
  const lastPaymentResult = await sql`
    SELECT MAX(pay_day) as last_payment_date 
    FROM payments 
    WHERE debts_id = ${debtId}
  `
  
  const lastPaymentDate = lastPaymentResult.rows[0]?.last_payment_date || debt.start_date
  const currentDate = new Date()
  const lastDate = new Date(lastPaymentDate + 'T12:00:00')
  
  // Calcular días desde el último pago
  const daysSinceLastPayment = Math.max(0, Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)))
  
  // Calcular interés diario
  const dailyInterestRate = interestRate / 100 / 365
  const accruedInterest = remainingCapital * dailyInterestRate * daysSinceLastPayment
  
  // El interés a pagar es el mínimo entre el interés acumulado y el monto del pago
  const interestToPay = Math.min(accruedInterest, paymentAmount)
  const capitalToPay = paymentAmount - interestToPay
  
  return {
    capitalPaid: capitalToPay,
    interestPaid: interestToPay
  }
}

export const POST = authMiddleware(async (req) => {
  const form = await req.json();
  const { debtID, paymentType, payValue, capitalPaid, interestPaid } = form;

  if (!debtID) return handleError("Id is required");

  try {
    let finalCapitalPaid = capitalPaid
    let finalInterestPaid = interestPaid
    
    // Si no se proporcionan capitalPaid e interestPaid, calcularlos
    if (finalCapitalPaid === undefined || finalInterestPaid === undefined) {
      const breakdown = await calculatePaymentBreakdown(debtID, payValue)
      finalCapitalPaid = breakdown.capitalPaid
      finalInterestPaid = breakdown.interestPaid
    }
    
    // Verificar que la suma sea igual al valor del pago
    if (Math.abs((finalCapitalPaid + finalInterestPaid) - payValue) > 0.01) {
      return handleError("La suma de capital e intereses debe ser igual al valor del pago")
    }

    // INSERT TO SQL
    await INSERT_PAYMENTS(debtID, paymentType, payValue, finalCapitalPaid, finalInterestPaid);

    // await UPDATE_FORMATT_PAYMENTS(payFormatted, debtID);
  } catch (error) {
    return handleError(error);
  }
  return handleSuccess("OK", 201);
});

export const DELETE = authMiddleware(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) return handleError("Id is required");

    const result = await SELECT_PAYMENTS(id);
    const { debtsid, payvalue } = result.rows[0];
    if (payvalue) {
      await UPDATE_PAYMENTS(payvalue, debtsid);
      await DELETE_PAYMENTS(id);
    }
    return handleSuccess("Payment deleted");
  } catch (e) {
    return handleError(e);
  }
});
