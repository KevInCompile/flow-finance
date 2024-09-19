// import { useEffect } from "react";
export default async function deleteIncomeService(id: number) {
  try {
    const fetching = await fetch(`/api/income?id=${id}`, {
      method: 'DELETE',
    })
    const data = await fetching.json()
    if (!data.message) return [new Error('Server error...')]
    return [undefined, data.message]
  } catch (error) {
    if (error) return [error]
  }
  return [new Error('Unknown error')]
}
