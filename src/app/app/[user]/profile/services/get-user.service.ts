export async function getUser(user: string) {
  try {
    const fetching = await fetch(`/api/get-user?username=${user}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const response = await fetching.json()
    if (!response.result) return [new Error('Error in server...')]
    return [undefined, response.result]
  } catch (error) {
    if (error) return [error]
  }
  return ['Unknown error']
}
