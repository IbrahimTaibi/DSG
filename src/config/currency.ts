// Currency Configuration for Tunisian Dinar (DT)
export const CURRENCY_CONFIG = {
  // Currency details
  code: 'TND',
  symbol: 'DT',
  name: 'Tunisian Dinar',
  
  // Formatting options
  locale: 'ar-TN', // Arabic locale for Tunisia
  decimalPlaces: 3, // Tunisian Dinar uses 3 decimal places
  
  // Display options
  position: 'after' as const, // Symbol after the number (e.g., 100.500 DT)
  spaceBetween: true, // Add space between number and symbol
  
  // Number formatting
  numberFormat: {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  },
} as const;

// Currency formatting functions
export const formatCurrency = (amount: number): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0.000 ${CURRENCY_CONFIG.symbol}`;
  }

  const formattedNumber = amount.toLocaleString(CURRENCY_CONFIG.locale, {
    minimumFractionDigits: CURRENCY_CONFIG.numberFormat.minimumFractionDigits,
    maximumFractionDigits: CURRENCY_CONFIG.numberFormat.maximumFractionDigits,
  });

  return CURRENCY_CONFIG.spaceBetween 
    ? `${formattedNumber} ${CURRENCY_CONFIG.symbol}`
    : `${formattedNumber}${CURRENCY_CONFIG.symbol}`;
};

// Format currency without symbol (just the number)
export const formatCurrencyNumber = (amount: number): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.000';
  }

  return amount.toLocaleString(CURRENCY_CONFIG.locale, {
    minimumFractionDigits: CURRENCY_CONFIG.numberFormat.minimumFractionDigits,
    maximumFractionDigits: CURRENCY_CONFIG.numberFormat.maximumFractionDigits,
  });
};

// Parse currency string back to number
export const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;
  
  // Remove currency symbol and spaces, then parse
  const cleanString = currencyString
    .replace(new RegExp(CURRENCY_CONFIG.symbol, 'g'), '')
    .replace(/\s/g, '')
    .replace(/[^\d.,]/g, '');
  
  // Handle different decimal separators
  const normalizedString = cleanString.replace(',', '.');
  
  const parsed = parseFloat(normalizedString);
  return isNaN(parsed) ? 0 : parsed;
};

// Get currency symbol
export const getCurrencySymbol = (): string => CURRENCY_CONFIG.symbol;

// Get currency code
export const getCurrencyCode = (): string => CURRENCY_CONFIG.code;

// Get currency name
export const getCurrencyName = (): string => CURRENCY_CONFIG.name;

// Format price range
export const formatPriceRange = (minPrice: number, maxPrice: number): string => {
  if (minPrice === maxPrice) {
    return formatCurrency(minPrice);
  }
  return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
}; 