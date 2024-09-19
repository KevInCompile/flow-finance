export default async function serviceDeleteExpense(id: number) {
  try {
    const res = await fetch(`/api/expenses?id=${id}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if (!data.message) return [new Error('Server error...')]
    return [undefined, data.message]
  } catch (error) {
    if (error) return [error]
  }
  return [new Error('Unknown error')]
}
