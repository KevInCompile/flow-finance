export default async function createItem(formData: FormData) {
  try {
    const res = await fetch("/api/account", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data) return [new Error("Error al crear la cuenta")];
    return [undefined, data];
  } catch (error) {
    if (error) return [error];
  }
  return [new Error("Unknown error")];
}

