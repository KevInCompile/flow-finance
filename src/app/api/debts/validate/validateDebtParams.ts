interface DebtParams {
  username?: string | null | undefined
  installments: number
  description: string
  totalamount: number
  startdate: string
  interest: number
}

export const validateDebtParams = (params: DebtParams) => {
  const { installments, description, totalamount } = params
  if (!installments || !description || !totalamount) {
    throw new Error('All dates are required')
  }
}
