export default async function createExpense(formData: FormData) {
  try{
    const res = await fetch('/api/expenses', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if(!data) return [new Error("Error al crear el gasto...")];
    return [undefined, data]
  } catch( error) {
   if(error) return [error]
  }
  return [new Error("Unknown error")]
}
