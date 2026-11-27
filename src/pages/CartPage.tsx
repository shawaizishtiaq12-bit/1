import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Tag, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ImagePlaceholder } from '@/components/ui';
import { formatPKR, shippingMessage } from '@/lib/format';

export function useCartTotals() {
  const { cart } = useStore();
  const eligible = cart.filter((l) => l.purchasable && l.price != null);
  const subtotal = eligible.reduce((n, l) => n + (l.price ?? 0) * l.qty, 0);
  const hasUnpriced = cart.some((l) => !l.purchasable || l.price == null);
  const qualifiesFreeShipping = subtotal > 5000;
  return { cart, eligible, subtotal, hasUnpriced, qualifiesFreeShipping };
}

export function CartPage() {
  const { updateQty, removeFromCart, coupon, applyCoupon, removeCoupon } = useStore();
  const { cart, subtotal, hasUnpriced, qualifiesFreeShipping } = useCartTotals();
  const [code, setCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 className="text-2xl font-bold text-ink">Your Cart</h1>
        <p className="max-w-sm text-sm text-muted">Your cart is empty. Explore our formulas and curated sets to begin.</p>
        <Link to="/shop" className="btn btn-primary">Shop All</Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-surface-mint">
        <div className="wrap px-5 py-12 sm:px-8 lg:px-12">
          <h1 className="text-3xl font-extrabold text-ink">Your Cart</h1>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y divide-ink/5">
            {cart.map((line) => (
              <li key={line.key} className="flex gap-5 py-6 first:pt-0">
                <div className="w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-grey">
                  {line.image ? (
                    <img src={line.image} alt={line.name} className="aspect-[4/5] w-full object-cover" />
                  ) : (
                    <ImagePlaceholder className="aspect-[4/5] w-full" label={line.kind === 'bundle' ? 'Set' : undefined} />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={line.kind === 'bundle' ? `/bundles/${line.slug}` : `/products/${line.slug}`}
                        className="text-[15px] font-semibold text-ink hover:text-primary-500"
                      >
                        {line.name}
                      </Link>
                      {line.kind === 'bundle' ? (
                        <p className="mt-1 text-[12px] font-semibold uppercase tracking-nav text-primary-500">Curated Set</p>
                      ) : null}
                    </div>
                    {line.purchasable && line.price != null ? (
                      <p className="text-[15px] font-semibold text-ink">{formatPKR((line.price ?? 0) * line.qty)}</p>
                    ) : (
                      <p className="text-[12px] font-medium text-warning-600">Awaiting price approval</p>
                    )}
                  </div>
                  {line.purchasable && line.price != null ? (
                    <p className="mt-1 text-[13px] text-muted">{formatPKR(line.price ?? 0)} each</p>
                  ) : null}
                  <div className="mt-auto flex items-center gap-4 pt-4">
                    <div className="inline-flex items-center rounded-full border border-ink/10">
                      <button type="button" onClick={() => updateQty(line.key, line.qty - 1)} className="px-3.5 py-2.5 hover:text-primary-500" aria-label={`Decrease quantity of ${line.name}`}>
                        <Minus size={14} />
                      </button>
                      <span className="min-w-7 text-center text-[13px] font-semibold">{line.qty}</span>
                      <button type="button" onClick={() => updateQty(line.key, line.qty + 1)} className="px-3.5 py-2.5 hover:text-primary-500" aria-label={`Increase quantity of ${line.name}`}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(line.key)} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted hover:text-error-600">
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-3xl border border-ink/5 bg-surface-grey p-7">
            <h2 className="mb-5 text-[15px] font-bold uppercase tracking-nav text-ink">Order Summary</h2>
            <div className="flex flex-col gap-2.5 text-[14px]">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-ink">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="font-semibold text-ink">
                  {subtotal === 0 ? '—' : qualifiesFreeShipping ? 'Free' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="mt-2 flex justify-between border-t border-ink/10 pt-3 text-[15px]">
                <span className="font-bold text-ink">Total</span>
                <span className="font-bold text-ink">{formatPKR(subtotal)}</span>
              </div>
            </div>
            {shippingMessage(subtotal) ? <p className="mt-4 text-[12px] leading-[150%] text-muted">{shippingMessage(subtotal)}</p> : null}

            <div className="mt-6 border-t border-ink/10 pt-5">
              <label className="field-label" htmlFor="coupon">
                <span className="inline-flex items-center gap-1.5"><Tag size={13} /> Discount Code</span>
              </label>
              {coupon ? (
                <div className="flex items-center justify-between rounded-full bg-primary-50 px-4 py-2.5 text-[13px] font-semibold text-primary-500">
                  <span>{coupon} saved</span>
                  <button type="button" onClick={() => { removeCoupon(); setCouponMsg(null); }} className="text-[12px] underline underline-offset-2">
                    Remove
                  </button>
                </div>
              ) : (
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!code.trim()) return;
                    const res = applyCoupon(code);
                    setCouponMsg(res.message);
                    setCode('');
                  }}
                >
                  <input
                    id="coupon"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter code"
                    className="field rounded-full"
                  />
                  <button type="submit" className="btn btn-ghost btn-sm">Apply</button>
                </form>
              )}
              {couponMsg ? <p className="mt-2 text-[12px] leading-[150%] text-muted">{couponMsg}</p> : null}
            </div>

            {hasUnpriced ? (
              <p className="mt-5 rounded-2xl bg-warning-50 px-4 py-3 text-[12px] leading-[150%] text-warning-600">
                Your cart includes items whose prices are not yet approved. Checkout unlocks once every item has a final approved price.
              </p>
            ) : null}

            <Link to="/checkout" className={`btn btn-primary mt-6 w-full ${hasUnpriced ? 'pointer-events-none opacity-40' : ''}`} aria-disabled={hasUnpriced}>
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="btn btn-secondary mt-3 w-full">Continue Shopping</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
