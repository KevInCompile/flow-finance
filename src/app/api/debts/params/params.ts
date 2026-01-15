export const getParamsDebt = (formData: FormData) => {
  const form = formData
  const description = form.get('description') as string
  const installments = parseInt(form.get('installments') as string)
  const paydate = form.get('paydate') as string
  const totalamount = parseInt(form.get('totalamount') as string)
  const startdate = form.get('startdate') as string
  const interest = parseFloat(form.get('interest') as string)

  return {
    description,
    installments,
    paydate,
    totalamount,
    startdate,
    interest
  }
}
