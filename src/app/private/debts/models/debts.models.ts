export interface Debt {
  id: number,
  installments: number,
  description: string,
  startdate: string,
  paydate: string
  totalamount: number,
  totalremaining: number,
  payments: Payments[]
}

interface Payments {
  id: number
  debtsid: number
  paymentstype: string
  paydate: string,
  totalremaining: number
}
