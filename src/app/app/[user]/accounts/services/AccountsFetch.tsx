// import { useEffect } from "react";

import axios from "axios";

export default async function AccountsFetch(username: string) {
  try {
    const fetch = await axios.get(
      `http://localhost:3000/api/account?username=${username}`,
    );

    if(!fetch) return [new Error("User is not found...")];
    return [undefined, fetch.data.rows];
  } catch (error) {
    if (error) return [error];
  }
  return [new Error("Unknown error")];
}
