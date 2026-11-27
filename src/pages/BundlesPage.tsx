import { Link, useParams } from 'react-router-dom';
import { Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { ImagePlaceholder, PriceTag, TemporaryNote } from '@/components/ui';
import { formatPKR } from '@/lib/format';

export function BundlesPage() {
  const { bundles, loading } = useStore();
  return (
    <>
      <section className="bg-surface-mint">
        <div className="wrap px-5 py-14 sm:px-8 md:py-20 lg:px-12">
          <p className="eyebrow mb-3">Curated Sets</p>
          <h1 className="max-w-3xl text-3xl font-extrabold text-ink md:text-[44px]">VELEURA Bundles</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[150%] text-muted">
            Complete routines, thoughtfully paired by our team. Each set combines complementary formulas at a set price — shown once approved.
          </p>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="wrap grid gap-8 md:grid-cols-3">
          {loading ? (
            <p className="text-sm text-muted">Loading bundles…</p>
          ) : (
            bundles.map((b, i) => (
              <article key={b.id} className="group flex flex-col overflow-hidden rounded-3xl border border-ink/5 bg-surface-mint animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <Link to={`/bundles/${b.slug}`} className="relative block" aria-label={`View ${b.name}`}>
                  {b.images?.[0] ? (
                    <img src={b.images[0]} alt={b.name} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <ImagePlaceholder label={b.name} className="aspect-[4/3] w-full" tone="cyan" />
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h2 className="text-[18px] font-bold text-ink">
                    <Link to={`/bundles/${b.slug}`} className="transition-colors hover:text-primary-500">{b.name}</Link>
                  </h2>
                  <p className="text-[13px] leading-[150%] text-muted">{b.short_intro}</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {b.items.map((p) => (
                      <li key={p.id} className="flex items-center gap-2 text-[13px] text-ink">
                        <Check size={14} className="text-primary-500" /> {p.name}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <PriceTag price={b.price_pkr} approved={b.price_approved} />
                    <Link to={`/bundles/${b.slug}`} className="btn btn-secondary btn-sm">View Set</Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export function BundleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { bundleBySlug, products, addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);
  const bundle = slug ? bundleBySlug(slug) : undefined;

  if (!bundle) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-muted">We could not find that bundle.</p>
        <Link to="/bundles" className="btn btn-primary btn-sm">Back to Bundles</Link>
      </div>
    );
  }

  const componentsTotal = bundle.items.reduce((n, p) => n + p.price_pkr, 0);
  const canBuy = bundle.price_approved && bundle.price_pkr != null && bundle.stock > 0;
  const wishlisted = isWishlisted(bundle.id);
  const related = products.filter((p) => !bundle.items.some((i) => i.id === p.id)).slice(0, 4);

  return (
    <>
      <div className="bg-white">
        <div className="wrap px-5 pt-8 sm:px-8 lg:px-12">
          <nav className="mb-6 flex items-center gap-2 text-[12px] text-muted" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-500">Home</Link>
            <span>/</span>
            <Link to="/bundles" className="hover:text-primary-500">Bundles</Link>
            <span>/</span>
            <span className="font-medium text-ink">{bundle.name}</span>
          </nav>
        </div>
        <div className="wrap grid gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div>
            {bundle.images?.[0] ? (
              <img src={bundle.images[0]} alt={bundle.name} className="aspect-square w-full rounded-[2rem] object-cover" />
            ) : (
              <ImagePlaceholder label={`${bundle.name} — image slot`} className="aspect-square w-full rounded-[2rem]" />
            )}
          </div>
          <div className="flex flex-col">
            <p className="eyebrow mb-2">Curated Set · {bundle.items.length} Products</p>
            <h1 className="text-3xl font-bold text-ink md:text-[38px]">{bundle.name}</h1>
            <div className="mt-3"><PriceTag price={bundle.price_pkr} approved={bundle.price_approved} className="text-[19px]" /></div>
            <p className="mt-4 max-w-lg text-[14px] leading-[150%] text-muted">{bundle.short_intro}</p>

            <div className="mt-6 rounded-3xl border border-ink/5 bg-surface-grey p-6">
              <h2 className="mb-3 text-[13px] font-bold uppercase tracking-nav text-ink">What's Inside</h2>
              <ul className="flex flex-col gap-2.5">
                {bundle.items.map((p) => (
                  <li key={p.id}>
                    <Link to={`/products/${p.slug}`} className="flex items-center justify-between gap-3 text-[14px] text-ink transition-colors hover:text-primary-500">
                      <span className="flex items-center gap-2"><Check size={15} className="text-primary-500" /> {p.name}</span>
                      <span className="text-[13px] text-muted">{formatPKR(p.price_pkr)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-ink/5 pt-3 text-[12px] text-muted">
                Components total {formatPKR(componentsTotal)} at individual prices. The set price appears once approved.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-ink/10">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 hover:text-primary-500" aria-label="Decrease quantity"><Minus size={16} /></button>
                <span className="min-w-8 text-center text-[14px] font-semibold">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} className="px-4 py-3 hover:text-primary-500" aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
              <button
                type="button"
                onClick={() =>
                  addToCart({
                    kind: 'bundle',
                    id: bundle.id,
                    slug: bundle.slug,
                    name: bundle.name,
                    price: bundle.price_pkr,
                    image: bundle.images?.[0] ?? null,
                    purchasable: bundle.price_approved && bundle.price_pkr != null,
                  }, qty)
                }
                disabled={!canBuy}
                className="btn btn-primary flex-1 sm:flex-none"
              >
                <ShoppingBag size={16} /> {canBuy ? 'Add to Cart' : 'Purchasing Soon'}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(bundle.id)}
                aria-pressed={wishlisted}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                  wishlisted ? 'border-primary-500 bg-primary-500 text-white' : 'border-ink/10 text-ink hover:border-primary-500 hover:text-primary-500'
                }`}
              >
                <Heart size={19} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="mt-6">
              <TemporaryNote>
                Bundle prices are being finalised by our team. The set price and purchasing will switch on as soon as it is approved — individual products remain available in the meantime.
              </TemporaryNote>
            </div>

            {bundle.description ? (
              <p className="mt-6 max-w-lg text-[14px] leading-[150%] text-muted">{bundle.description}</p>
            ) : null}
          </div>
        </div>
      </div>

      <section className="section-pad bg-surface-grey">
        <div className="wrap">
          <h2 className="mb-6 text-2xl font-bold text-ink">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={{ ...p, price: p.price_pkr, image: p.images?.[0] ?? null, purchasable: p.price_approved }} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
