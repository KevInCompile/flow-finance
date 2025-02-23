interface DebtParams {
  username?: string | null | undefined
  fee: string
  description: string
  payday: string
  totaldue: number
  feevalue: number,
  datestart: string,
  dateend: string,
  interest: number,
}

export const validateDebtParams = (params: DebtParams) => {
  const { fee, description, payday, totaldue, feevalue } = params
  if (!fee || !description || !payday || !totaldue || !feevalue) {
    throw new Error('All dates are required')
  }
}
