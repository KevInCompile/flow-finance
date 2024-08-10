export interface Debt {
  id: number,
  fee: number,
  description: string,
  paid: number,
  payday: number
  totaldue: number,
  payments: Payments[]
}

interface Payments {
  id: number
  debtsid: number
  paymentstype: string
  payvalue: number
  payday: string
}
