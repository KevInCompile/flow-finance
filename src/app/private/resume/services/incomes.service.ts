import axios from 'axios'

export const serviceIncomes = async () => {
  try {
    const fetching = await axios.get(`/api/income`)
    const { data } = fetching
    return data.result
  } catch (e) {
    console.log(e)
  }
}
