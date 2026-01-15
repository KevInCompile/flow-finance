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
  // Handle NaN, null, undefined, and non-numeric values
  if (value === null || value === undefined) {
    value = 0
  }
  
  // Convert to number if it's a string
  if (typeof value === 'string') {
    const numValue = parseFloat(value)
    value = isNaN(numValue) ? 0 : numValue
  }
  
  // Ensure it's a number
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    value = 0
  }
  
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
