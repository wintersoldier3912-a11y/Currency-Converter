import { CurrencyCode, ExchangeRates } from './types';

// Base rates relative to USD
// In a real app, these would come from an API.
// We use these as a fallback/static set as requested by the "MVP" requirements.
export const STATIC_RATES: ExchangeRates = {
  base: 'USD',
  rates: {
    [CurrencyCode.USD]: 1.0,
    [CurrencyCode.EUR]: 0.92,
    [CurrencyCode.GBP]: 0.79,
    [CurrencyCode.INR]: 83.25,
    [CurrencyCode.JPY]: 151.42,
    [CurrencyCode.CAD]: 1.36,
    [CurrencyCode.AUD]: 1.52,
    [CurrencyCode.CHF]: 0.91,
    [CurrencyCode.CNY]: 7.23,
    [CurrencyCode.NZD]: 1.65,
    [CurrencyCode.SGD]: 1.35,
    [CurrencyCode.HKD]: 7.82,
    [CurrencyCode.KRW]: 1345.50
  },
  timestamp: new Date().toISOString()
};

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  [CurrencyCode.USD]: 'US Dollar',
  [CurrencyCode.EUR]: 'Euro',
  [CurrencyCode.GBP]: 'British Pound',
  [CurrencyCode.INR]: 'Indian Rupee',
  [CurrencyCode.JPY]: 'Japanese Yen',
  [CurrencyCode.CAD]: 'Canadian Dollar',
  [CurrencyCode.AUD]: 'Australian Dollar',
  [CurrencyCode.CHF]: 'Swiss Franc',
  [CurrencyCode.CNY]: 'Chinese Yuan',
  [CurrencyCode.NZD]: 'New Zealand Dollar',
  [CurrencyCode.SGD]: 'Singapore Dollar',
  [CurrencyCode.HKD]: 'Hong Kong Dollar',
  [CurrencyCode.KRW]: 'South Korean Won'
};

export const FLAGS: Record<CurrencyCode, string> = {
  [CurrencyCode.USD]: '🇺🇸',
  [CurrencyCode.EUR]: '🇪🇺',
  [CurrencyCode.GBP]: '🇬🇧',
  [CurrencyCode.INR]: '🇮🇳',
  [CurrencyCode.JPY]: '🇯🇵',
  [CurrencyCode.CAD]: '🇨🇦',
  [CurrencyCode.AUD]: '🇦🇺',
  [CurrencyCode.CHF]: '🇨🇭',
  [CurrencyCode.CNY]: '🇨🇳',
  [CurrencyCode.NZD]: '🇳🇿',
  [CurrencyCode.SGD]: '🇸🇬',
  [CurrencyCode.HKD]: '🇭🇰',
  [CurrencyCode.KRW]: '🇰🇷'
};
