import { Link } from 'react-router-dom';
import { HeartOff, Lock, PackageSearch, UserRound } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { PageHero } from '@/components/Section';

export function WishlistPage() {
  const { wishlist, products } = useStore();
  const items = wishlist
    .map((id) => products.find((p) => p.id === id) ?? null)
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ ...p, price: p.price_pkr, image: p.images?.[0] ?? null, purchasable: p.price_approved }));

  return (
    <>
      <PageHero eyebrow="Saved Items" title="Wishlist" intro="Products you have saved for later, kept on this device." />
      <section className="section-pad bg-white">
        <div className="wrap">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <HeartOff size={36} className="text-primary-300" />
              <p className="max-w-sm text-sm text-muted">Your wishlist is empty. Tap the heart on any product to save it here.</p>
              <Link to="/shop" className="btn btn-primary">Explore Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 50} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function AccountPage() {
  return (
    <>
      <PageHero eyebrow="Your VELEURA" title="Customer Account" intro="Sign in to manage your details, view order history and track deliveries." />
      <section className="section-pad bg-white">
        <div className="wrap grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            { icon: UserRound, title: 'Account Details', body: 'Registration and sign-in are being connected to a secure customer authentication service and will open soon.' },
            { icon: PackageSearch, title: 'Order History & Tracking', body: 'Your past orders and live tracking will appear here, visible only to you. Until then, use the Track Order page.' },
            { icon: Lock, title: 'Secure by Design', body: 'Access to orders is restricted to the signed-in customer. Order numbers or email alone never grant access.' },
          ].map((c) => (
            <div key={c.title} className="rounded-3xl border border-ink/5 bg-surface-grey p-7">
              <c.icon size={22} className="mb-4 text-primary-500" />
              <h2 className="mb-2 text-[15px] font-bold text-ink">{c.title}</h2>
              <p className="text-[13px] leading-[150%] text-muted">{c.body}</p>
            </div>
          ))}
        </div>
        <div className="wrap mt-10 flex flex-wrap gap-4">
          <Link to="/track-order" className="btn btn-primary">Track an Order</Link>
          <Link to="/shop" className="btn btn-secondary">Continue Shopping</Link>
        </div>
      </section>
    </>
  );
}
