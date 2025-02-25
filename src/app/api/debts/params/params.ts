export const getParamsDebt = (formData: FormData) => {
  const form = formData
  const description = form.get('description') as string
  const installments = form.get('installments') as string
  const paydate = form.get('paydate') as string
  const totalamount = parseFloat(form.get('totalamount')!.toString().replace(/,/g, ''))
  const startdate = form.get('startdate') as string
  const interest = parseFloat(form.get('interest')!.toString())

  return {
    description,
    installments,
    paydate,
    totalamount,
    startdate,
    interest
  }
}
