export default async function debtsFetch() {
  try {
    const fetching = await fetch(`/api/debts`)
    const data = await fetching.json()
    if (!data) return [new Error('Server error')]
    return [undefined, data]
  } catch (error) {
    if (error) return [error]
  }
  return [new Error('Unknown error')]
}
