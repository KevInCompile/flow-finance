import axios from "axios";

export default async function createItem(formData: FormData) {
  try{
    const res = await axios.post('http://localhost:3000/api/account', formData);
    if(res.status !== 200) return [new Error("Error at creating account...")];
    return [undefined, res.data]
  } catch( error) {
   if(error) return [error]
  }
  return [new Error("Unknown error")]
}