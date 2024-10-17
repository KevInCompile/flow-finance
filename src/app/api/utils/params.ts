export const getParams = (formData: FormData) => {
  const form = formData
  const name = form.get('name') as string
  const value = parseFloat(form.get('value') as string)
  const type = form.get('type') as string
  const accountId = form.get('accountid') as string
  const categoryId = form.get('categoryid') as string
  const description = form.get('description') as string

  return {
    name,
    value,
    type,
    accountId,
    categoryId,
    description,
  }
}
