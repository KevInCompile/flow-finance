export default async function createExpense(object: any) {
  try{
    const res = await fetch('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(object)
    })
    const data = await res.json()
    if(!data) return [new Error("Error al crear el gasto...")];
    return [undefined, data]
  } catch( error) {
   if(error) return [error]
  }
  return [new Error("Unknown error")]
}
