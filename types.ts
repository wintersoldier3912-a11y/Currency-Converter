export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR',
  JPY = 'JPY',
  CAD = 'CAD',
  AUD = 'AUD',
  CHF = 'CHF',
  CNY = 'CNY',
  NZD = 'NZD',
  SGD = 'SGD',
  HKD = 'HKD',
  KRW = 'KRW'
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  timestamp: string;
}

export interface ConversionRecord {
  id: string;
  amount: number;
  from: CurrencyCode;
  to: CurrencyCode;
  result: number;
  rate: number;
  date: string;
}

export interface TrendPoint {
  day: string;
  rate: number;
}
