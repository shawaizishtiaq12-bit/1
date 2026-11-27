import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { ImagePlaceholder, PriceTag, Stars, TemporaryNote } from '@/components/ui';
import { formatPKR } from '@/lib/format';
import type { Product } from '@/lib/types';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { productBySlug, products, bundles, addToCart, toggleWishlist, isWishlisted, markViewed, recentlyViewed } = useStore();
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  const product = slug ? productBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1);
    setImgIndex(0);
    if (product) markViewed(product.id);
  }, [product, markViewed]);

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-muted">We could not find that product.</p>
        <Link to="/shop" className="btn btn-primary btn-sm">Back to Shop</Link>
      </div>
    );
  }

  const gallery = product.images.length > 0 ? product.images : [null, null, null];
  const wishlisted = isWishlisted(product.id);
  const inStock = product.stock > 0;
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);
  const fbtBundle = bundles.find((b) => b.items.some((p) => p.id === product.id));
  const viewed = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p) && p!.id !== product.id)
    .slice(0, 4);
  const fbtItems = fbtBundle
    ? fbtBundle.items.filter((p) => p.id !== product.id).map((p) => ({ ...p, price: p.price_pkr, image: p.images?.[0] ?? null, purchasable: p.price_approved }))
    : related.slice(0, 2).map((p) => ({ ...p, price: p.price_pkr, image: p.images?.[0] ?? null, purchasable: p.price_approved }));

  return (
    <>
      <div className="bg-white">
        <div className="wrap px-5 pt-8 sm:px-8 lg:px-12">
          <nav className="mb-6 flex items-center gap-2 text-[12px] text-muted" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-500">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary-500">Shop</Link>
            <span>/</span>
            <span className="font-medium text-ink">{product.name}</span>
          </nav>
        </div>
        <div className="wrap grid gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div>
            <div
              className="relative overflow-hidden rounded-[2rem] bg-surface-grey"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              {gallery[imgIndex] ? (
                <img
                  src={gallery[imgIndex] as string}
                  alt={`${product.name} image ${imgIndex + 1}`}
                  className={`aspect-square w-full object-cover transition-transform duration-700 ease-out ${zoom ? 'scale-125' : 'scale-100'}`}
                />
              ) : (
                <ImagePlaceholder label={`${product.name} — image slot ${imgIndex + 1}`} className="aspect-square w-full transition-transform duration-700 ease-out" />
              )}
              {gallery.length > 1 ? (
                <>
                  <button type="button" onClick={() => setImgIndex((imgIndex - 1 + gallery.length) % gallery.length)} className="absolute left-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm" aria-label="Previous image">
                    <ChevronLeft size={18} />
                  </button>
                  <button type="button" onClick={() => setImgIndex((imgIndex + 1) % gallery.length)} className="absolute right-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm" aria-label="Next image">
                    <ChevronRight size={18} />
                  </button>
                </>
              ) : null}
            </div>
            {gallery.length > 1 ? (
              <div className="mt-4 flex gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`overflow-hidden rounded-2xl border-2 transition-colors ${i === imgIndex ? 'border-primary-500' : 'border-transparent'}`}
                  >
                    {g ? (
                      <img src={g} alt="" className="h-16 w-16 object-cover transition-transform duration-500 hover:scale-110" />
                    ) : (
                      <ImagePlaceholder className="h-16 w-16" />
                    )}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col">
            <p className="eyebrow mb-2">{product.category === 'toner' ? 'Toner' : 'Serum'}</p>
            <h1 className="text-3xl font-bold text-ink md:text-[38px]">{product.name}</h1>
            <div className="mt-3"><PriceTag price={product.price_pkr} approved={product.price_approved} className="text-[19px]" /></div>
            <p className="mt-4 max-w-lg text-[14px] leading-[150%] text-muted">{product.short_intro}</p>

            <div className="mt-5 flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold uppercase tracking-nav ${inStock ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'}`}>
                {inStock ? 'In stock' : 'Sold out'}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-ink/10">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 text-ink hover:text-primary-500" aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span className="min-w-8 text-center text-[14px] font-semibold">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} className="px-4 py-3 text-ink hover:text-primary-500" aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  addToCart({
                    kind: 'product',
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price_pkr,
                    image: product.images?.[0] ?? null,
                    purchasable: product.price_approved,
                  }, qty)
                }
                disabled={!inStock || !product.price_approved}
                className="btn btn-primary flex-1 sm:flex-none"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={wishlisted}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                  wishlisted ? 'border-primary-500 bg-primary-500 text-white' : 'border-ink/10 text-ink hover:border-primary-500 hover:text-primary-500'
                }`}
              >
                <Heart size={19} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {!product.price_approved ? (
              <div className="mt-6">
                <TemporaryNote>
                  Pricing is being finalised. This product currently shows a temporary placeholder price of {formatPKR(product.price_pkr)} while the final approved price is prepared — purchasing is disabled until then.
                </TemporaryNote>
              </div>
            ) : null}

            <div className="mt-8 grid gap-3 rounded-3xl bg-surface-grey p-5 text-[13px] text-ink sm:grid-cols-2">
              <p className="flex items-center gap-2"><Truck size={16} className="text-primary-500" /> Free delivery above ₨ 5,000</p>
              <p className="flex items-center gap-2"><ShieldCheck size={16} className="text-primary-500" /> Genuine VELEURA formulas</p>
            </div>
          </div>
        </div>
      </div>

      <section className="section-pad bg-surface-mint">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="mb-3 text-xl font-bold text-ink">Full Description</h2>
              <p className="text-[14px] leading-[150%] text-muted">
                {product.description || 'The full owner-approved description for this product will appear here once supplied.'}
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-xl font-bold text-ink">Ingredients</h2>
              <p className="text-[14px] leading-[150%] text-muted">
                {product.ingredients || 'The complete ingredient list will be published once approved by our team. We never list unverified ingredients.'}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="mb-3 text-xl font-bold text-ink">How to Use</h2>
              <p className="text-[14px] leading-[150%] text-muted">
                {product.how_to_use || 'Usage guidance will appear here once approved. Always patch-test new products and follow the directions on the packaging.'}
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-xl font-bold text-ink">Product Details</h2>
              {product.details.length > 0 ? (
                <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-[150%] text-muted">
                  {product.details.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              ) : (
                <p className="text-[14px] leading-[150%] text-muted">Additional product details will appear here once approved.</p>
              )}
            </div>
            <div>
              <h2 className="mb-3 text-xl font-bold text-ink">FAQs</h2>
              {product.faqs.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {product.faqs.map((f, i) => (
                    <details key={i} className="group rounded-2xl border border-ink/5 bg-white px-5 py-4">
                      <summary className="cursor-pointer list-none text-[14px] font-semibold text-ink marker:hidden">
                        {f.q}
                      </summary>
                      <p className="mt-2 text-[13px] leading-[150%] text-muted">{f.a}</p>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] leading-[150%] text-muted">Product-specific questions and answers will appear here once approved.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="wrap">
          <h2 className="mb-2 text-2xl font-bold text-ink">Customer Reviews</h2>
          <p className="mb-8 max-w-xl text-[14px] leading-[150%] text-muted">
            We publish only genuine, verified reviews. Reviews for this product will appear here as customers share their experiences.
          </p>
          <h2 className="mb-6 text-2xl font-bold text-ink">Frequently Bought Together</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {fbtItems.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface-grey">
        <div className="wrap">
          <h2 className="mb-6 text-2xl font-bold text-ink">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard
                key={p.id}
                product={{ ...p, price: p.price_pkr, image: p.images?.[0] ?? null, purchasable: p.price_approved }}
                delay={i * 60}
              />
            ))}
          </div>
          {viewed.length > 0 ? (
            <>
              <h2 className="mb-6 mt-16 text-2xl font-bold text-ink">Recently Viewed</h2>
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {viewed.map((p, i) => (
                  <ProductCard key={p.id} product={{ ...p, price: p.price_pkr, image: p.images?.[0] ?? null, purchasable: p.price_approved }} delay={i * 60} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
