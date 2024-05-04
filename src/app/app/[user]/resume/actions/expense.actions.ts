import axios from "axios";

export default async function createExpense(formData: FormData) {
  try{
    const res = await axios.post('http://localhost:3000/api/expenses', formData);
    if(res.status !== 200) return [new Error("Error al crear el gasto...")];
    return [undefined, res.data]
  } catch( error) {
   if(error) return [error]
  }
  return [new Error("Unknown error")]
}