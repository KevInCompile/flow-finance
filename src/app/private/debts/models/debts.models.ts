export interface Debt {
  id: number,
  installments: number,
  description: string,
  start_date: string,
  pay_date: string
  total_amount: number,
  total_remaining: number,
  interest: number,
  accumulated_interest: number,
  total_with_interest: number,
  monthly_payment: number,
  total_payment: number,
  total_interest: number,
  amortization_table: AmortizationRow[],
  last_interest_calculation: string,
  payments: Payments[]
}

export interface AmortizationRow {
  month: number,
  payment: number,
  interest: number,
  principal: number,
  remainingBalance: number
}

interface Payments {
  id: number
  debtsid: number
  paymentstype: string
  paydate: string,
  totalremaining: number
}
