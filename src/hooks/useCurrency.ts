import { useMemo } from 'react';
import { 
  formatCurrency, 
  formatCurrencyNumber, 
  parseCurrency, 
  formatPriceRange, 
  formatPercentage,
  getCurrencySymbol,
  getCurrencyCode,
  getCurrencyName,
  CURRENCY_CONFIG 
} from '@/config/currency';

export const useCurrency = () => {
  const currencyUtils = useMemo(() => ({
    // Format functions
    format: formatCurrency,
    formatNumber: formatCurrencyNumber,
    parse: parseCurrency,
    formatRange: formatPriceRange,
    formatPercentage,
    
    // Currency info
    symbol: getCurrencySymbol(),
    code: getCurrencyCode(),
    name: getCurrencyName(),
    config: CURRENCY_CONFIG,
    
    // Helper functions
    isValid: (amount: number): boolean => {
      return amount !== null && amount !== undefined && !isNaN(amount) && amount >= 0;
    },
    
    // Format with custom options
    formatWithOptions: (amount: number, options?: {
      showSymbol?: boolean;
      decimalPlaces?: number;
    }) => {
      if (!currencyUtils.isValid(amount)) {
        return options?.showSymbol ? `0.000 ${currencyUtils.symbol}` : '0.000';
      }
      
      const decimalPlaces = options?.decimalPlaces ?? CURRENCY_CONFIG.numberFormat.minimumFractionDigits;
      
      const formattedNumber = amount.toLocaleString(CURRENCY_CONFIG.locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
      
      if (options?.showSymbol === false) {
        return formattedNumber;
      }
      
      return CURRENCY_CONFIG.spaceBetween 
        ? `${formattedNumber} ${currencyUtils.symbol}`
        : `${formattedNumber}${currencyUtils.symbol}`;
    },
    
    // Format compact (e.g., 1.5K DT, 2.3M DT)
    formatCompact: (amount: number): string => {
      if (!currencyUtils.isValid(amount)) {
        return `0 ${currencyUtils.symbol}`;
      }
      
      const formatter = new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
      });
      
      const formattedNumber = formatter.format(amount);
      return CURRENCY_CONFIG.spaceBetween 
        ? `${formattedNumber} ${currencyUtils.symbol}`
        : `${formattedNumber}${currencyUtils.symbol}`;
    },
    
    // Format for input fields (without symbol)
    formatForInput: (amount: number): string => {
      if (!currencyUtils.isValid(amount)) {
        return '';
      }
      
      return amount.toLocaleString(CURRENCY_CONFIG.locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: CURRENCY_CONFIG.numberFormat.maximumFractionDigits,
      });
    },
  }), []);

  return currencyUtils;
}; 