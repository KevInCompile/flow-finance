export async function getUser() {
  try {
    const fetching = await fetch(`/api/get-user`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const response = await fetching.json()
    if (!response.result) return [new Error('Server error')]
    return [undefined, response.result]
  } catch (error) {
    if (error) return [error]
  }
  return ['Unknown error']
}
