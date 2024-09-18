import axios from 'axios'

export async function deleteSavingGoal(id: number) {
  try {
    const { data } = await axios.delete(`/api/saving-goals?id=${id}`)
    if (data.error) return [new Error(data.error)]
    return [undefined, data.message]
  } catch (error) {
    if (error) return [error]
  }
  return ['Unknown error']
}
