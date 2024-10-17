export const getParamsDebt = (formData: FormData) => {
  const form = formData
  const description = form.get('description') as string
  const fee = form.get('fee') as string
  const payday = form.get('payday') as string
  const totaldue = parseFloat(form.get('totalDue')!.toString().replace(/,/g, ''))
  const feevalue = parseFloat(form.get('feeValue')!.toString().replace(/,/g, ''))

  return {
    description,
    fee,
    payday,
    totaldue,
    feevalue,
  }
}
