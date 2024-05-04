// import { useEffect } from "react";
export default async function CategoriesFetch() {
  try {
    const fetching = await fetch(
      `http://localhost:3000/api/categories`,
    );
    const data = await fetching.json()
    if(!data) return [new Error("Error en el servidor...")];
    return [undefined, data.rows];
  } catch (error) {
    if (error) return [error];
  }
  return [new Error("Unknown error")];
}
