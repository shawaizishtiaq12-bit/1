import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ImagePlaceholder, PriceTag } from './ui';

export interface CardProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number | null;
  image: string | null;
  purchasable: boolean;
  stock: number;
}

export function ProductCard({ product, delay = 0 }: { product: CardProduct; delay?: number }) {
  const { addToCart } = useStore();
  return (
    <article className="group flex flex-col animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <Link
        to={`/products/${product.slug}`}
        className="relative block overflow-hidden rounded-3xl bg-surface-grey"
        aria-label={`View ${product.name}`}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <ImagePlaceholder label={product.name} className="aspect-[4/5] w-full transition-transform duration-700 ease-out group-hover:scale-110" />
        )}
        {product.stock <= 0 ? (
          <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-nav text-white">
            Sold out
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-1 px-1 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-nav text-muted">{product.category === 'toner' ? 'Toner' : 'Serum'}</p>
        <Link to={`/products/${product.slug}`} className="text-[15px] font-semibold text-ink transition-colors hover:text-primary-500">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceTag price={product.price} approved={product.purchasable} />
          <button
            type="button"
            onClick={() => addToCart({ ...product, kind: 'product' })}
            disabled={product.stock <= 0 || !product.purchasable}
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-all duration-300 hover:bg-primary-500 hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function BundleCard({
  bundle,
  delay = 0,
}: {
  bundle: { slug: string; name: string; price_pkr: number | null; price_approved: boolean; short_intro: string; itemNames: string[]; image: string | null };
  delay?: number;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-ink/5 bg-surface-mint animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <Link to={`/bundles/${bundle.slug}`} className="relative block" aria-label={`View ${bundle.name}`}>
        {bundle.image ? (
          <img src={bundle.image} alt={bundle.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        ) : (
          <ImagePlaceholder label={bundle.name} className="aspect-[4/3] w-full transition-transform duration-700 ease-out group-hover:scale-110" tone="cyan" />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="eyebrow">Curated Set</p>
        <Link to={`/bundles/${bundle.slug}`} className="text-[17px] font-bold text-ink transition-colors hover:text-primary-500">
          {bundle.name}
        </Link>
        <p className="text-[13px] leading-[150%] text-muted">{bundle.short_intro}</p>
        <p className="text-[12px] font-medium text-muted">
          {bundle.itemNames.length} products · {bundle.itemNames.join(' + ')}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <PriceTag price={bundle.price_pkr} approved={bundle.price_approved} />
          <Link to={`/bundles/${bundle.slug}`} className="btn btn-secondary btn-sm">
            View Set
          </Link>
        </div>
      </div>
    </article>
  );
}
