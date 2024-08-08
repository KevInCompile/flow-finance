export const getParamsPayments = (formData: FormData) => {
  const form = formData
  // values
  const debtID = form.get('debtsID') as string
  const paymentType = form.get('paymentType') as string
  const payDay = form.get('payDay') as string
  const payValue = parseFloat(form.get('payValue')!.toString().replace(/,/g, ''))

  return {
    debtID,
    paymentType,
    payDay,
    payValue
  }
}
