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

export const formatCurrency = (value: number): string => {
  if (typeof window !== 'undefined') {
    const userCurrency = window.localStorage.getItem('userCurrency') || 'COP'
    const formatter = new Intl.NumberFormat(
      currencyToLocale[userCurrency] || 'en-US',
      {
        style: 'currency',
        currency: userCurrency,
      }
    )
    return formatter.format(value)
  }
  return '0'
}
