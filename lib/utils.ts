export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(priceInCents / 100);
}