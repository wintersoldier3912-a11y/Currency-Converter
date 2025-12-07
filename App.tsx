import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CurrencyCode, 
  ExchangeRates, 
  ConversionRecord, 
  TrendPoint 
} from './types';
import { STATIC_RATES, FLAGS, CURRENCY_NAMES } from './constants';
import { fetchRates, convertCurrency, getHistoricalTrend } from './services/currencyService';
import { TrendChart } from './components/TrendChart';

// SVG Icons
const SwapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10h14l-4-4"/>
    <path d="M17 14H3l4 4"/>
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 16h5v5"/>
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v5h5"/>
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
    <path d="M12 7v5l4 2"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

function App() {
  // --- State ---
  const [rates, setRates] = useState<ExchangeRates>(STATIC_RATES);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const [amount, setAmount] = useState<string>('100');
  const [amountError, setAmountError] = useState<string | null>(null);
  
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>(CurrencyCode.USD);
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(CurrencyCode.EUR);
  
  const [conversionResult, setConversionResult] = useState<number | null>(null);
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);

  const currencyMismatch = fromCurrency === toCurrency;

  // --- Effects ---

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('conversion_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage when it changes
  useEffect(() => {
    localStorage.setItem('conversion_history', JSON.stringify(history));
  }, [history]);

  // Initial Data Fetch & Mode switching
  const updateRates = useCallback(async (live: boolean) => {
    setLoading(true);
    try {
      const newRates = await fetchRates(live);
      setRates(newRates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch rates", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateRates(isLiveMode);
  }, [updateRates, isLiveMode]);

  // Auto-convert when inputs change
  useEffect(() => {
    // Basic validation logic matches the input handler logic
    if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
      setConversionResult(null);
      setCurrentRate(null);
      // We don't clear trend data to avoid flickering, but we stop processing
      return;
    }

    const { result, rate } = convertCurrency(
      Number(amount), 
      fromCurrency, 
      toCurrency, 
      rates
    );
    
    setConversionResult(result);
    setCurrentRate(rate);
    setTrendData(getHistoricalTrend(fromCurrency, toCurrency, rate));

  }, [amount, fromCurrency, toCurrency, rates]);


  // --- Handlers ---

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val);

    // Immediate validation feedback
    if (val === '') {
      setAmountError(null);
      return;
    }

    const num = Number(val);
    if (isNaN(num)) {
      setAmountError('Please enter a valid number');
    } else if (num < 0) {
      setAmountError('Amount cannot be negative');
    } else {
      setAmountError(null);
    }
  };

  // Prevent invalid characters like minus sign, 'e', 'E'
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent typing of negative sign, exponent 'e' or 'E', and plus sign
    if (['-', 'e', 'E', '+'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSaveToHistory = () => {
    if (!conversionResult || !currentRate || amountError || currencyMismatch) return;
    
    const newRecord: ConversionRecord = {
      id: Date.now().toString(),
      amount: Number(amount),
      from: fromCurrency,
      to: toCurrency,
      result: conversionResult,
      rate: currentRate,
      date: new Date().toISOString()
    };

    setHistory(prev => [newRecord, ...prev].slice(0, 10)); // Keep last 10
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const currencyOptions = useMemo(() => Object.values(CurrencyCode), []);

  // --- Render Helpers ---

  const formatCurrency = (val: number, code: CurrencyCode) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center p-4 md:p-8">
      
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Converter Card */}
        <div className="lg:col-span-2 space-y-6">
          
          <header className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Zenith Converter
            </h1>
            <p className="text-slate-400 text-sm">
              Professional foreign exchange rates and tools.
            </p>
          </header>

          <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 md:p-8 relative overflow-hidden">
            {/* Live Mode Indicator */}
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full transition-colors border ${
                  isLiveMode 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-700/50 text-slate-400 border-slate-600'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                {isLiveMode ? 'Live API' : 'Static Mode'}
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end mt-6">
              
              {/* Amount & From */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale group-focus-within:grayscale-0 transition-all">
                    {FLAGS[fromCurrency]}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={handleAmountChange}
                    onKeyDown={handleKeyDown}
                    className={`w-full bg-slate-900 border rounded-xl py-4 pl-12 pr-4 text-2xl font-semibold text-white focus:outline-none focus:ring-2 transition-all ${
                      amountError 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-slate-600 focus:ring-blue-500'
                    }`}
                    placeholder="0.00"
                  />
                  {amountError && (
                    <div className="absolute left-1 -bottom-6 text-xs text-red-400 font-medium animate-fade-in">
                      {amountError}
                    </div>
                  )}
                </div>
                <div className="relative group">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-900 transition-colors"
                  >
                    {currencyOptions.map(code => (
                      <option key={code} value={code}>
                        {code} - {CURRENCY_NAMES[code]}
                      </option>
                    ))}
                  </select>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 border border-slate-600 text-slate-200 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {CURRENCY_NAMES[fromCurrency]}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-600"></div>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center md:pb-12">
                <button
                  onClick={handleSwap}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full border border-slate-600 text-slate-300 hover:text-white transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                  aria-label="Swap currencies"
                >
                  <SwapIcon />
                </button>
              </div>

              {/* To Currency (Result placeholder in input style) */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Converted To</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale group-focus-within:grayscale-0 transition-all">
                    {FLAGS[toCurrency]}
                  </span>
                  <div className="w-full bg-slate-900/50 border border-slate-700 border-dashed rounded-xl py-4 pl-12 pr-4 text-2xl font-semibold text-slate-300 flex items-center h-[66px]">
                   {conversionResult ? conversionResult.toFixed(2) : '---'}
                  </div>
                </div>
                <div className="relative group">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                    className={`w-full bg-slate-900/50 border rounded-lg py-2 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-900 transition-colors ${
                      currencyMismatch ? 'border-red-500 focus:border-red-500' : 'border-slate-700'
                    }`}
                  >
                    {currencyOptions.map(code => (
                      <option key={code} value={code}>
                        {code} - {CURRENCY_NAMES[code]}
                      </option>
                    ))}
                  </select>
                  {currencyMismatch && (
                    <div className="absolute left-1 -bottom-6 text-xs text-red-400 font-medium animate-fade-in">
                      Source and target currencies cannot be the same
                    </div>
                  )}
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 border border-slate-600 text-slate-200 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {CURRENCY_NAMES[toCurrency]}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-600"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Highlight */}
            <div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-slate-400 font-medium">Exchange Rate</span>
                  <div className="relative group">
                    <InfoIcon className="w-4 h-4 text-slate-500 hover:text-blue-400 cursor-help transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 border border-slate-600 text-slate-200 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      Rates updated: {lastUpdated.toLocaleString()}
                      {/* Arrow for tooltip */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-600"></div>
                    </div>
                  </div>
                </div>
                <div className="text-lg md:text-xl font-mono text-slate-200">
                  1 {fromCurrency} = <span className="text-blue-400 font-bold">{currentRate?.toFixed(4)}</span> {toCurrency}
                </div>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  {loading && <RefreshIcon className="animate-spin w-3 h-3" />}
                  <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>
              
              <button 
                onClick={handleSaveToHistory}
                disabled={!conversionResult || !!amountError || currencyMismatch}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-blue-900/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Save Calculation</span>
              </button>
            </div>

            {/* Chart */}
            <TrendChart data={trendData} from={fromCurrency} to={toCurrency} />

          </div>
        </div>

        {/* Sidebar / History */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 h-full flex flex-col overflow-hidden max-h-[600px] lg:max-h-none">
             <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 backdrop-blur">
                <h2 className="font-bold text-lg flex items-center gap-2 text-slate-200">
                  <HistoryIcon />
                  History
                </h2>
                {history.length > 0 && (
                  <button 
                    onClick={handleClearHistory}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 hover:bg-red-400/10 rounded transition-colors"
                  >
                    <TrashIcon /> Clear
                  </button>
                )}
             </div>

             <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                    <HistoryIcon />
                    <p className="mt-2 text-sm">No recent conversions</p>
                    <p className="text-xs text-slate-600">Calculations you save will appear here.</p>
                  </div>
                ) : (
                  history.map((record) => (
                    <div key={record.id} className="bg-slate-900/50 hover:bg-slate-900 border border-slate-700/50 rounded-lg p-3 transition-colors group">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-slate-300 font-medium">
                          {formatCurrency(record.amount, record.from)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                        <span>to</span>
                        <span className="text-emerald-400 font-mono text-sm">
                          {formatCurrency(record.result, record.to)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-mono">
                        Rate: {record.rate.toFixed(4)}
                      </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;