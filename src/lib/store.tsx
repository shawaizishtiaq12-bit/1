import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from './supabase';
import { FALLBACK_BLOCKS, type Bundle, type CartLineItem, type ContentBlocks, type Product } from './types';

export interface AddLine {
  kind: 'product' | 'bundle';
  id: string;
  slug: string;
  name: string;
  price: number | null;
  image: string | null;
  purchasable: boolean;
}

interface StoreState {
  loading: boolean;
  error: string | null;
  products: Product[];
  bundles: Bundle[];
  blocks: ContentBlocks;
  cart: CartLineItem[];
  wishlist: string[];
  recentlyViewed: string[];
  cartOpen: boolean;
  coupon: string | null;
  setCartOpen: (open: boolean) => void;
  addToCart: (line: AddLine, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  markViewed: (id: string) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  productBySlug: (slug: string) => Product | undefined;
  bundleBySlug: (slug: string) => Bundle | undefined;
}

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = 'veleura-cart-v1';
const WISHLIST_KEY = 'veleura-wishlist-v1';
const VIEWED_KEY = 'veleura-viewed-v1';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [blocks, setBlocks] = useState<ContentBlocks>(FALLBACK_BLOCKS);
  const [cart, setCart] = useState<CartLineItem[]>(() => readJSON<CartLineItem[]>(CART_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readJSON<string[]>(WISHLIST_KEY, []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => readJSON<string[]>(VIEWED_KEY, []));
  const [cartOpen, setCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [productsRes, bundlesRes, contentRes] = await Promise.all([
        supabase.from('products').select('*').eq('published', true).order('display_order'),
        supabase.from('bundles').select('*, bundle_items(*, products(*))').eq('published', true).order('display_order'),
        supabase.from('content_blocks').select('id, payload'),
      ]);
      if (!active) return;
      if (productsRes.error || bundlesRes.error) {
        setError('We could not load the VELEURA catalogue. Please refresh the page.');
        setLoading(false);
        return;
      }
      const loadedProducts = (productsRes.data ?? []) as unknown as Product[];
      const loadedBundles = ((bundlesRes.data ?? []) as unknown as (Bundle & {
        bundle_items: { position: number; products: Product }[];
      })[]).map((b) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        price_pkr: b.price_pkr,
        price_approved: b.price_approved,
        stock: b.stock,
        images: Array.isArray(b.images) ? b.images : [],
        short_intro: b.short_intro,
        description: b.description,
        display_order: b.display_order,
        items: (b.bundle_items ?? [])
          .slice()
          .sort((a, z) => a.position - z.position)
          .map((bi) => bi.products),
      }));
      setProducts(loadedProducts);
      setBundles(loadedBundles);
      if (!contentRes.error && contentRes.data) {
        const next = { ...FALLBACK_BLOCKS };
        for (const row of contentRes.data as { id: string; payload: unknown }[]) {
          if (row.id in next) {
            (next as Record<string, unknown>)[row.id] = row.payload;
          }
        }
        setBlocks(next);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem(VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = useCallback((line: AddLine, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.key === line.kind + ':' + line.id);
      if (existing) {
        return prev.map((l) => (l.key === existing.key ? { ...l, qty: Math.min(l.qty + qty, 99) } : l));
      }
      return [...prev, { ...line, key: line.kind + ':' + line.id, qty }];
    });
    setCartOpen(true);
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 99) } : l)),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  }, []);

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const markViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => [id, ...prev.filter((v) => v !== id)].slice(0, 8));
  }, []);

  const applyCoupon = useCallback((_code: string) => {
    setCoupon(_code.trim().toUpperCase());
    return {
      ok: true,
      message: 'Code saved. Discounts will be validated when checkout goes live.',
    };
  }, []);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const productBySlug = useCallback((slug: string) => products.find((p) => p.slug === slug), [products]);
  const bundleBySlug = useCallback((slug: string) => bundles.find((b) => b.slug === slug), [bundles]);

  const value = useMemo<StoreState>(
    () => ({
      loading,
      error,
      products,
      bundles,
      blocks,
      cart,
      wishlist,
      recentlyViewed,
      cartOpen,
      coupon,
      setCartOpen,
      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      markViewed,
      applyCoupon,
      removeCoupon,
      productBySlug,
      bundleBySlug,
    }),
    [
      loading,
      error,
      products,
      bundles,
      blocks,
      cart,
      wishlist,
      recentlyViewed,
      cartOpen,
      coupon,
      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      markViewed,
      applyCoupon,
      removeCoupon,
      productBySlug,
      bundleBySlug,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
