import axios from 'axios'

export async function moneySavingAction(body: any) {
  try {
    const { data } = await axios.put(`/api/saving-goals`, body)
    if (data.error) return [new Error(data.error)]
    return [undefined, data.message]
  } catch (error) {
    if (error) return [error]
  }
  return ['Unknown error']
}
