// import { useEffect } from "react";
export default async function deleteIncomeService(id: number) {
  try {
    const fetching = await fetch(
      `/api/incomes?id=${id}`,
      {
        method: 'DELETE'
      }
    );
    const data = await fetching.json()
    if(!data.message) return [new Error("Error en el servidor...")];
    return [undefined, data.message];
  } catch (error) {
    if (error) return [error];
  }
  return [new Error("Unknown error")];
}
