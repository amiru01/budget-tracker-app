/* eslint react-refresh/only-export-components: "off" */
import React from 'react'

const CurrencyContext = React.createContext(null)

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', INR: '₹',
  AED: 'د.إ', AFN: '؋', ALL: 'L', AMD: '֏', ANG: 'ƒ', AOA: 'Kz',
  ARS: '$', AUD: '$', AWG: 'ƒ', AZN: '₼', BAM: 'KM', BBD: '$',
  BDT: '৳', BGN: 'лв', BHD: '.د.ب', BIF: 'Fr', BMD: '$', BND: '$',
  BOB: 'Bs.', BRL: 'R$', BSD: '$', BTC: '₿', BTN: 'Nu.', BWP: 'P',
  BYN: 'Br', BZD: '$', CAD: '$', CDF: 'Fr', CHF: 'Fr', CLP: '$',
  COP: '$', CRC: '₡', CUP: '$', CVE: '$', CZK: 'Kč', DJF: 'Fr',
  DKK: 'kr', DOP: '$', DZD: 'د.ج', EGP: '£', ERN: 'Nfk', ETB: 'Br',
  ETH: 'Ξ', FJD: '$', FKP: '£', GEL: '₾', GGP: '£', GHS: '₵',
  GIP: '£', GMD: 'D', GNF: 'Fr', GTQ: 'Q', GYD: '$', HKD: '$',
  HNL: 'L', HRK: 'kn', HTG: 'G', HUF: 'Ft', IDR: 'Rp', ILS: '₪',
  IMP: '£', IQD: 'ع.د', IRR: '﷼', ISK: 'kr', JEP: '£', JMD: '$',
  JOD: 'د.ا', KES: 'KSh', KGS: 'с', KHR: '៛', KMF: 'Fr', KPW: '₩',
  KRW: '₩', KWD: 'د.ك', KYD: '$', KZT: '₸', LAK: '₭', LBP: 'ل.ل',
  LKR: 'Rs', LRD: '$', LSL: 'L', LYD: 'ل.د', MAD: 'د.م.', MDL: 'L',
  MGA: 'Ar', MKD: 'ден', MMK: 'K', MNT: '₮', MOP: 'P', MRU: 'UM',
  MUR: '₨', MVR: 'ރ.', MWK: 'MK', MXN: '$', MYR: 'RM', MZN: 'MT',
  NAD: '$', NGN: '₦', NIO: 'C$', NOK: 'kr', NPR: '₨', NZD: '$',
  OMR: 'ر.ع.', PAB: 'B/.', PEN: 'S/.', PGK: 'K', PHP: '₱', PKR: '₨',
  PLN: 'zł', PYG: '₲', QAR: 'ر.ق', RON: 'lei', RSD: 'дин.', RUB: '₽',
  RWF: 'Fr', SAR: 'ر.س', SBD: '$', SCR: '₨', SDG: 'ج.س.', SEK: 'kr',
  SGD: '$', SHP: '£', SLL: 'Le', SOS: 'Sh', SRD: '$', SSP: '£',
  STN: 'Db', SYP: '£', SZL: 'L', THB: '฿', TJS: 'ЅМ', TMT: 'm',
  TND: 'د.ت', TOP: 'T$', TRY: '₺', TTD: '$', TWD: '$', TZS: 'Sh',
  UAH: '₴', UGX: 'Sh', UYU: '$', UZS: "so'm", VES: 'Bs.', VND: '₫',
  VUV: 'Vt', WST: 'T', XAF: 'Fr', XCD: '$', XOF: 'Fr', XPF: 'Fr',
  YER: '﷼', ZAR: 'R', ZMW: 'ZK', ZWL: '$'
}

function CurrencyProvider({ children }) {
  const [currency, setCurrency] = React.useState(() => {
    // Load from localStorage or default to USD
    return localStorage.getItem('selectedCurrency') || 'USD'
  })

  // Save to localStorage when currency changes
  React.useEffect(() => {
    localStorage.setItem('selectedCurrency', currency)
  }, [currency])

  const getCurrencySymbol = React.useCallback((code = currency) => {
    return CURRENCY_SYMBOLS[code] || '$'
  }, [currency])

  const formatCurrency = React.useCallback((value, currencyCode = currency) => {
    const abs = Math.abs(value)
    const symbol = getCurrencySymbol(currencyCode)
    const formatted = abs.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return value < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`
  }, [currency, getCurrencySymbol])

  const value = React.useMemo(
    () => ({ currency, setCurrency, getCurrencySymbol, formatCurrency }),
    [currency, getCurrencySymbol, formatCurrency]
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

function useCurrency() {
  const ctx = React.useContext(CurrencyContext)
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return ctx
}

export { CurrencyProvider, useCurrency }
