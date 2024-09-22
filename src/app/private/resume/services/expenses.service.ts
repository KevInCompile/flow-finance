export default async function ExpensesFetch() {
  try {
    const fetching = await fetch('/api/expenses')
    const data = await fetching.json()
    if (!data) return [new Error('Error en el servidor...')]
    return [undefined, data.result]
  } catch (error) {
    if (error) return [error]
  }
  return [new Error('Unknown error')]
}
