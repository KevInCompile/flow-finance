
export default async function createPayment(params: any) {
  try{
    const res = await fetch('/api/payments', {
      method: 'POST',
      body: JSON.stringify(params)
    })
    const data = await res.json()
    if(!data || data.error) return [new Error("Error al registrar abono")];
    return [undefined, data]
  } catch( error) {
      if(error) return [error]
  }
  return [new Error("Unknown error")]
}
