export default async function createIncome(body: any) {
  try{
    const res = await fetch('/api/income', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if(data.error) return [new Error(data.error)];
    return [undefined, data]
  } catch( error) {
   if(error) return [error]
  }
  return [new Error("Unknown error")]
}
