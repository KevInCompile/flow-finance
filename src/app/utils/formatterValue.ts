const currencyToLocale: { [key: string]: string } = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  COP: 'es-CO',
  MXN: 'es-MX',
  ARS: 'es-AR',
  BRL: 'pt-BR',
  CLP: 'es-CL',
  PEN: 'es-PE',
}

export const formatterValue = (
  value: string,
  setValue: (value: string) => void
) => {
  const cleanValue = value.replace(/[^0-9]/g, '')
  if (cleanValue === '') return setValue('0')

  const numberValue = parseInt(cleanValue, 10)
  const userCurrency = localStorage.getItem('userCurrency') || 'USD'

  return setValue(
    numberValue.toLocaleString(currencyToLocale[userCurrency] || 'en-US', {
      style: 'currency',
      currency: userCurrency,
    })
  )
}
