export async function updateUserCurrency(username: string, currency: string) {
  try {
    const fetching = await fetch('/api/get-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, currency }),
    })
    const response = await fetching.json()
    if (response.error) return [new Error(response.error)]
    return [undefined, response.message]
  } catch (error) {
    if (error) return [error]
  }
  return ['Unknown error']
}
