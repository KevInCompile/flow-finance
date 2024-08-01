// import { useEffect } from "react";
export default async function debtsFetch(username: string) {
  try {
    const fetching = await fetch(
      `/api/debts?username=${username}`,
      {cache: 'no-store'}
    );
    const data = await fetching.json()
    if(!data) return [new Error("User is not found...")];
    return [undefined, data.rows];
  } catch (error) {
    if (error) return [error];
  }
  return [new Error("Unknown error")];
}
