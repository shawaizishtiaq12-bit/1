export function formatPKR(amount: number): string {
  return `₨ ${amount.toLocaleString('en-PK')}`;
}

export function priceLabel(price: number | null, approved: boolean): string {
  if (!approved || price == null) return 'Price to be confirmed';
  return formatPKR(price);
}

export const FREE_SHIPPING_THRESHOLD = 5000;

export function shippingMessage(subtotal: number): string | null {
  if (subtotal <= 0) return null;
  if (subtotal > FREE_SHIPPING_THRESHOLD) {
    return 'Your order qualifies for free delivery across Pakistan.';
  }
  const remaining = FREE_SHIPPING_THRESHOLD + 1 - subtotal;
  return `Add ${formatPKR(remaining)} more to qualify for free delivery (eligible total must exceed ₨ 5,000).`;
}
