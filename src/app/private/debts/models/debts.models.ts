export interface Debt {
  id: number,
  installments: number,
  description: string,
  start_date: string,
  pay_date: string
  total_amount: number,
  total_remaining: number,
  payments: Payments[]
}

interface Payments {
  id: number
  debtsid: number
  paymentstype: string
  paydate: string,
  totalremaining: number
}
