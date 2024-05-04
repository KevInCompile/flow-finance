// import { useEffect } from "react";
export default async function AccountsFetch(username: string) {
  try {
    const fetching = await fetch(
      `/api/account?username=${username}`,
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
