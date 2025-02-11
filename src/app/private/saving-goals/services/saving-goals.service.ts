import axios from 'axios'

export default async function serviceGetSavingGoals() {
  try {
    const { data, status } = await axios.get(`/api/saving-goals`)
    if (status === 500) return [new Error(data.error)]
    if (status === 200) return [undefined, data]
  } catch (e) {
    if (e) return [e]
  }
  return ['Unknown error']
}
