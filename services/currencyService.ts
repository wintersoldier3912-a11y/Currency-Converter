import { STATIC_RATES } from '../constants';
import { CurrencyCode, ExchangeRates, TrendPoint } from '../types';

/**
 * Simulates fetching rates. 
 * If 'live' is true, we add small random fluctuations to simulate a live market.
 */
export const fetchRates = async (live: boolean = false): Promise<ExchangeRates> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!live) {
        resolve(STATIC_RATES);
        return;
      }

      // Simulate live market fluctuations
      const fluctuatedRates = { ...STATIC_RATES.rates };
      Object.keys(fluctuatedRates).forEach((key) => {
        const volatility = 0.005; // 0.5% volatility
        const change = 1 + (Math.random() * volatility * 2 - volatility);
        fluctuatedRates[key] = Number((fluctuatedRates[key] * change).toFixed(4));
      });

      resolve({
        ...STATIC_RATES,
        rates: fluctuatedRates,
        timestamp: new Date().toISOString()
      });
    }, 600); // 600ms network delay simulation
  });
};

/**
 * Core conversion logic.
 * Formula: (Amount / BaseToFromRate) * BaseToToRate
 */
export const convertCurrency = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: ExchangeRates
): { result: number; rate: number } => {
  const baseRates = rates.rates;
  
  // 1. Convert 'from' currency to Base (USD)
  // If from is USD, rate is 1. If from is EUR (0.92), we divide amount by 0.92 to get USD.
  const amountInBase = amount / baseRates[from];

  // 2. Convert Base (USD) to 'to' currency
  const result = amountInBase * baseRates[to];

  // Calculate the direct exchange rate for display (1 From = X To)
  const directRate = baseRates[to] / baseRates[from];

  return {
    result,
    rate: directRate
  };
};

/**
 * Generates mock historical data for the chart.
 * In a real app, this would fetch from a historical API.
 */
export const getHistoricalTrend = (
  from: CurrencyCode,
  to: CurrencyCode,
  currentRate: number
): TrendPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data: TrendPoint[] = [];
  
  let previousRate = currentRate;

  // Generate 7 days of data working backwards, but push in reverse order
  for (let i = 0; i < 7; i++) {
    // Add some random noise to create a trend
    const noise = (Math.random() - 0.5) * (currentRate * 0.02);
    const dailyRate = previousRate + noise;
    previousRate = dailyRate;
    
    data.unshift({
      day: days[6 - i],
      rate: Number(dailyRate.toFixed(4))
    });
  }
  
  // Ensure the last point matches current reality closely
  data[6].rate = currentRate;
  
  return data;
};
