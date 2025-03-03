interface DebtParams {
  username?: string | null | undefined
  installments: number
  description: string
  paydate: number
  totalamount: number
  startdate: string
  interest: number
}

export const validateDebtParams = (params: DebtParams) => {
  const { installments, description, paydate, totalamount } = params
  if (!installments || !description || !paydate || !totalamount) {
    throw new Error('All dates are required')
  }
}
