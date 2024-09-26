// import { useEffect } from "react";
export default async function AccountsFetch() {
  try {
    const fetching = await fetch(`/api/account`)
    const data = await fetching.json()
    if (!data) return [new Error('User is not found...')]
    return [undefined, data.result]
  } catch (error) {
    if (error) return [error]
  }
  return [new Error('Unknown error')]
}
