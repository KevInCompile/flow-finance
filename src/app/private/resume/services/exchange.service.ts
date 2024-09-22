export const exchangeService = async (data: any) => {
  try {
    const fetching = await fetch('/api/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromAccountId: data.fromAccount,
        toAccountId: data.toAccount,
        value: data.amount,
      }),
    })
    const response = await fetching.json()
    if (response.error) return [new Error('Ups, server error 😔')]
    return [undefined, response.message]
  } catch (err) {
    if (err) return [err]
  }
  return ['Unknwon error']
}
