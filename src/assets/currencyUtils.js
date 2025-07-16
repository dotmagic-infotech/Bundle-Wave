const currencySymbols = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
    JPY: '¥',
    CNY: '¥',
    KRW: '₩',
    RUB: '₽',
    AED: 'د.إ',
    BRL: 'R$',
    ZAR: 'R',
    SGD: 'S$',
    HKD: 'HK$',
    NZD: 'NZ$',
};

export const getCurrencySymbol = (currencyCode = 'USD') =>
    currencySymbols[currencyCode.toUpperCase()] || currencyCode;
