import axios from "axios"

export const serviceIncomes = async (username: string) => {
  try {
    const fetching = await axios.get(`/api/income?username=${username}`)
    const {data} = fetching
    return data.result
  }catch(e){
    console.log(e)
  }
}
