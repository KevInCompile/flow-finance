export const formatterValue = (value: string, setValue: (value: string) => void) => {
  const validateNumber =  /^[0-9,]*$/.test(value)
  if(value === '') return setValue('0')
  if(!validateNumber) return
  let numberWithoutComma = parseFloat(value.replace(/,/g, ''))
  return setValue(Number(numberWithoutComma).toLocaleString())
}