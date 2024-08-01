
export default async function createDebt(formData: FormData) {

   try{
    const res = await fetch('/api/debts', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if(data.error) return [new Error(data.error)];
    return [undefined, data]
  } catch( error) {
   if(error) return [error]
  }
  return [new Error("Unknown error")]
}
