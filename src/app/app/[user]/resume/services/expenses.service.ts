export default async function ExpensesFetch() {
  try {
    const fetching = await fetch(`http://localhost:3000/api/expenses`,
      {cache: 'no-store'}
    );
    const data = await fetching.json()
    if(!data) return [new Error("Error en el servidor...")];
    return [undefined, data.rows];
  } catch (error) {
    if (error) return [error];
  }
  return [new Error("Unknown error")]
}