import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ProductCard, BundleCard } from '@/components/ProductCard';
import { PageHero } from '@/components/Section';
import { ImagePlaceholder } from '@/components/ui';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'popular';

const CONCERNS: Record<string, (p: { name: string; category: string }) => boolean> = {
  Hydration: (p) => /hydrat|hylauron/i.test(p.name),
  'Oil & Blemishes': (p) => /salicyl|niacinam|retinol|oil/i.test(p.name),
  Radiance: (p) => /vitamin c|glutathione/i.test(p.name),
  'Even Tone': (p) => /niacinam|glutathione|vitamin c/i.test(p.name),
};

export function ShopPage() {
  const { products, bundles, loading } = useStore();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const category = params.get('category') ?? 'all';
  const concern = params.get('concern') ?? '';
  const [sort, setSort] = useState<SortKey>('featured');
  const [search, setSearch] = useState(query);

  const filtered = useMemo(() => {
    let list = products.map((p) => ({ ...p, price: p.price_pkr, image: p.images?.[0] ?? null, purchasable: p.price_approved }));
    if (query) list = list.filter((p) => (p.name + ' ' + p.short_intro).toLowerCase().includes(query.toLowerCase()));
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (concern && CONCERNS[concern]) list = list.filter((p) => CONCERNS[concern](p));
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price_pkr - b.price_pkr);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price_pkr - a.price_pkr);
        break;
      case 'popular':
        list.sort((a, b) => Number(b.community_favourite) - Number(a.community_favourite));
        break;
      default:
        list.sort((a, b) => a.display_order - b.display_order);
    }
    return list;
  }, [products, query, category, concern, sort]);

  const filteredBundles = useMemo(() => {
    if (!query) return bundles;
    return bundles.filter((b) => (b.name + ' ' + b.short_intro).toLowerCase().includes(query.toLowerCase()));
  }, [bundles, query]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    if (key !== 'q') next.delete('concern');
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHero
        eyebrow="The Collection"
        title="Shop All"
        intro="Every VELEURA formula — individual products and curated sets, each clearly presented with availability and pricing."
      />
      <section className="section-pad bg-white">
        <div className="wrap">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form
              className="relative w-full max-w-sm"
              onSubmit={(e) => {
                e.preventDefault();
                setParam('q', search);
              }}
            >
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="field rounded-full pl-10"
              />
            </form>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'serum', label: 'Serums' },
                { key: 'toner', label: 'Toners' },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setParam('category', c.key)}
                  className={`rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-nav transition-colors ${
                    category === c.key ? 'bg-primary-500 text-white' : 'bg-surface-grey text-ink hover:bg-primary-50 hover:text-primary-500'
                  }`}
                >
                  {c.label}
                </button>
              ))}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort products"
                className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-[12px] font-semibold uppercase tracking-nav text-ink"
              >
                <option value="featured">Featured</option>
                <option value="popular">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {concern ? (
            <p className="mb-6 text-[13px] text-muted">
              Showing products for <span className="font-semibold text-ink">{concern}</span>{' '}
              <button type="button" onClick={() => setParam('concern', '')} className="underline underline-offset-2 hover:text-primary-500">
                clear
              </button>
            </p>
          ) : null}

          {loading ? (
            <p className="py-16 text-center text-sm text-muted">Loading products…</p>
          ) : filtered.length === 0 && filteredBundles.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <ImagePlaceholder label="No results" className="h-24 w-24 rounded-full" />
              <p className="text-sm text-muted">No products match your search. Try a different term or browse everything.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={i * 50} />
                ))}
              </div>
              {filteredBundles.length > 0 ? (
                <div className="mt-16">
                  <h2 className="mb-6 text-xl font-bold text-ink">Curated Sets</h2>
                  <div className="grid gap-6 md:grid-cols-3">
                    {filteredBundles.map((b, i) => (
                      <BundleCard
                        key={b.id}
                        bundle={{
                          slug: b.slug,
                          name: b.name,
                          price_pkr: b.price_pkr,
                          price_approved: b.price_approved,
                          short_intro: b.short_intro,
                          itemNames: b.items.map((p) => p.name.replace(/ (Serum|Toner)$/, '')),
                          image: b.images?.[0] ?? null,
                        }}
                        delay={i * 60}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}
