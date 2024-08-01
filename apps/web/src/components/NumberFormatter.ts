export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
  notation: 'compact',
});

export const longCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  notation: 'standard',
});

export const basicFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  notation: 'standard',
});
