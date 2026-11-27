import { Link } from 'react-router-dom';
import { AlertTriangle, Banknote, CreditCard, Smartphone } from 'lucide-react';
import { useCartTotals } from './CartPage';
import { ImagePlaceholder } from '@/components/ui';
import { formatPKR } from '@/lib/format';

const PAYMENT_METHODS = [
  { key: 'cod', label: 'Cash on Delivery', icon: Banknote, note: 'Pay when your order arrives.' },
  { key: 'jazzcash', label: 'JazzCash', icon: Smartphone, note: 'Mobile wallet payment.' },
  { key: 'easypaisa', label: 'Easypaisa', icon: Smartphone, note: 'Mobile wallet payment.' },
  { key: 'card', label: 'Debit / Credit Card', icon: CreditCard, note: 'Visa and Mastercard.' },
];

export function CheckoutPage() {
  const { cart, subtotal, hasUnpriced, qualifiesFreeShipping } = useCartTotals();
  const belowThresholdShippingMissing = subtotal > 0 && !qualifiesFreeShipping;
  const checkoutBlocked = hasUnpriced || belowThresholdShippingMissing;

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 className="text-2xl font-bold text-ink">Checkout</h1>
        <p className="max-w-sm text-sm text-muted">Your cart is empty — add products before checking out.</p>
        <Link to="/shop" className="btn btn-primary">Shop All</Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-surface-mint">
        <div className="wrap px-5 py-12 sm:px-8 lg:px-12">
          <h1 className="text-3xl font-extrabold text-ink">Checkout</h1>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_380px]">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-10">
            <fieldset disabled={checkoutBlocked} className={checkoutBlocked ? 'opacity-50' : ''}>
              <legend className="mb-5 text-[15px] font-bold uppercase tracking-nav text-ink">Delivery Details</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="co-name">Full Name</label>
                  <input id="co-name" className="field" placeholder="Your name" autoComplete="name" />
                </div>
                <div>
                  <label className="field-label" htmlFor="co-phone">Phone Number</label>
                  <input id="co-phone" className="field" placeholder="03xx xxxxxxx" type="tel" autoComplete="tel" />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="co-email">Email Address</label>
                  <input id="co-email" className="field" placeholder="you@example.com" type="email" autoComplete="email" />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="co-address">Delivery Address</label>
                  <input id="co-address" className="field" placeholder="House, street, area" autoComplete="street-address" />
                </div>
                <div>
                  <label className="field-label" htmlFor="co-city">City</label>
                  <input id="co-city" className="field" placeholder="City" autoComplete="address-level2" />
                </div>
                <div>
                  <label className="field-label" htmlFor="co-notes">Delivery Instructions (optional)</label>
                  <input id="co-notes" className="field" placeholder="e.g. leave with reception" />
                </div>
              </div>
            </fieldset>

            <div>
              <h2 className="mb-5 text-[15px] font-bold uppercase tracking-nav text-ink">Payment Method</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.key} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink/10 p-4 transition-colors hover:border-primary-500 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                    <input type="radio" name="payment" value={m.key} className="mt-1" disabled={checkoutBlocked} />
                    <m.icon size={18} className="mt-0.5 text-primary-500" />
                    <span>
                      <span className="block text-[14px] font-semibold text-ink">{m.label}</span>
                      <span className="block text-[12px] text-muted">{m.note}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-[12px] leading-[150%] text-muted">
                Payment providers are being finalised with our merchants. No payment is taken and no order is placed from this page yet.
              </p>
            </div>
          </form>

          <aside className="flex h-fit flex-col gap-5 rounded-3xl border border-ink/5 bg-surface-grey p-7">
            <h2 className="text-[15px] font-bold uppercase tracking-nav text-ink">Order Summary</h2>
            <ul className="flex flex-col gap-3">
              {cart.map((line) => (
                <li key={line.key} className="flex items-center gap-3">
                  <div className="w-12 shrink-0 overflow-hidden rounded-xl">
                    {line.image ? (
                      <img src={line.image} alt="" className="aspect-[4/5] w-full object-cover" />
                    ) : (
                      <ImagePlaceholder className="aspect-[4/5] w-full" />
                    )}
                  </div>
                  <div className="flex flex-1 justify-between gap-2 text-[13px]">
                    <span className="font-medium text-ink">{line.name} × {line.qty}</span>
                    {line.purchasable && line.price != null ? (
                      <span className="font-semibold text-ink">{formatPKR((line.price ?? 0) * line.qty)}</span>
                    ) : (
                      <span className="text-warning-600">TBC</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-ink/10 pt-4 text-[14px]">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold text-ink">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-muted">Shipping</span>
              <span className="font-semibold text-ink">{qualifiesFreeShipping ? 'Free' : 'Not configured'}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-4 text-[15px]">
              <span className="font-bold text-ink">Total</span>
              <span className="font-bold text-ink">{formatPKR(subtotal)}</span>
            </div>

            <div className="rounded-2xl bg-warning-50 p-4">
              <p className="flex items-start gap-2 text-[12px] font-semibold leading-[150%] text-warning-600">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                {belowThresholdShippingMissing
                  ? 'Checkout is currently unavailable. Your order total does not qualify for free delivery, and the delivery fee for orders under ₨ 5,001 has not been configured yet. Please check back soon.'
                  : 'Checkout is currently unavailable while product prices are being finalised. No order or payment will be processed yet.'}
              </p>
            </div>
            <Link to="/cart" className="btn btn-secondary">Back to Cart</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
