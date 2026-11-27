import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '@/lib/store';
import { ImagePlaceholder } from './ui';
import { formatPKR } from '@/lib/format';

type MegaItem = { label: string; to: string; desc?: string };
type NavItem =
  | { to: string; label: string; mega?: never }
  | { label: string; to?: never; mega: { columns: { heading: string; items: MegaItem[] }[]; featured?: { label: string; desc: string; to: string } } };

const NAV: NavItem[] = [
  { to: '/', label: 'Home' },
  {
    label: 'Shop',
    mega: {
      columns: [
        {
          heading: 'By Category',
          items: [
            { label: 'Shop All Products', to: '/shop', desc: 'Browse the full VELEURA range' },
            { label: 'Serums', to: '/shop?category=serum', desc: 'Targeted, active-led formulas' },
            { label: 'Toners', to: '/shop?category=toner', desc: 'Prep, balance & refine' },
          ],
        },
        {
          heading: 'By Concern',
          items: [
            { label: 'Brightening', to: '/shop?concern=Brightening', desc: 'Even tone & radiance' },
            { label: 'Hydration', to: '/shop?concern=Hydration', desc: 'Deep moisture barrier support' },
            { label: 'Anti-Ageing', to: '/shop?concern=Anti-Ageing', desc: 'Retinol & renewal actives' },
            { label: 'Acne & Clarity', to: '/shop?concern=Acne+%26+Clarity', desc: 'Salicylic & clarifying' },
          ],
        },
      ],
      featured: { label: 'Curated Bundles', desc: 'Complete routines paired for results.', to: '/bundles' },
    },
  },
  {
    label: 'Bundles',
    mega: {
      columns: [
        {
          heading: 'Sets',
          items: [
            { label: 'All Bundles', to: '/bundles', desc: 'Every curated set in one place' },
            { label: 'Starter Sets', to: '/bundles', desc: 'New to VELEURA? Start here' },
            { label: 'Brightening Duo', to: '/bundles', desc: 'Vitamin C + Niacinamide' },
            { label: 'Hydration Bundle', to: '/bundles', desc: 'HA Serum + Barrier Toner' },
          ],
        },
        {
          heading: 'Gift Ready',
          items: [
            { label: 'Gift a Bundle', to: '/bundles', desc: 'Premium packaging on every set' },
            { label: 'Best Sellers Set', to: '/bundles', desc: 'The most-loved products paired' },
          ],
        },
      ],
      featured: { label: 'Build Your Routine', desc: 'Find the right products for your skin.', to: '/shop' },
    },
  },
  {
    label: 'About',
    mega: {
      columns: [
        {
          heading: 'Our World',
          items: [
            { label: 'About VELEURA', to: '/about', desc: 'The brand story & mission' },
            { label: 'Contact Us', to: '/contact', desc: 'We reply within one business day' },
          ],
        },
        {
          heading: 'Help',
          items: [
            { label: 'FAQs', to: '/faqs', desc: 'Common questions answered' },
            { label: 'Shipping & Returns', to: '/shipping-returns', desc: 'Delivery times & policies' },
            { label: 'Track Order', to: '/track-order', desc: 'Follow your package' },
          ],
        },
      ],
    },
  },
];

function MegaMenu({ item, onClose }: { item: Extract<NavItem, { mega: NonNullable<unknown> }>; onClose: () => void }) {
  return (
    <div
      className="absolute left-1/2 top-full z-40 w-[700px] max-w-[96vw] -translate-x-1/2 animate-fade-in"
      role="region"
      aria-label={`${item.label} menu`}
    >
      <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
        <div className={`grid gap-0 ${item.mega.featured ? 'grid-cols-[1fr_1fr_220px]' : 'grid-cols-2'}`}>
          {item.mega.columns.map((col) => (
            <div key={col.heading} className="border-r border-white/[0.08] p-6">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-white/40">{col.heading}</p>
              <ul className="flex flex-col gap-1">
                {col.items.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="group/link flex flex-col rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.08]"
                    >
                      <span className="text-[13px] font-semibold text-white/90 transition-colors group-hover/link:text-white">{link.label}</span>
                      {link.desc ? <span className="mt-0.5 text-[11px] leading-[140%] text-white/45">{link.desc}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {item.mega.featured ? (
            <div className="flex flex-col justify-between bg-white/[0.05] p-6">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Featured</p>
                <p className="text-[15px] font-bold leading-[130%] text-white">{item.mega.featured.label}</p>
                <p className="mt-2 text-[12px] leading-[150%] text-white/50">{item.mega.featured.desc}</p>
              </div>
              <Link
                to={item.mega.featured.to}
                onClick={onClose}
                className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-black transition-opacity hover:opacity-90"
              >
                Explore <ArrowRight size={12} />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { cart, wishlist, setCartOpen } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled ? 'border-white/10 bg-primary-500/95 shadow-md backdrop-blur-md' : 'border-transparent bg-primary-500'
        }`}
      >
        <div className="wrap flex h-[72px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="lg:w-[200px]" aria-label="VELEURA home">
            <Logo />
          </Link>

          {/* Desktop mega-menu nav */}
          <nav ref={navRef} className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map((item) => {
              if (item.mega) {
                const isOpen = activeMenu === item.label;
                return (
                  <div key={item.label} className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveMenu(item.label)}
                      onMouseLeave={() => setActiveMenu(null)}
                      onClick={() => setActiveMenu(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                      className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-medium uppercase tracking-nav transition-colors hover:bg-white/10 hover:text-white ${
                        isOpen ? 'bg-white/10 text-white' : 'text-white/85'
                      }`}
                    >
                      {item.label}
                      <svg
                        width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {isOpen ? (
                      <div
                        onMouseEnter={() => setActiveMenu(item.label)}
                        onMouseLeave={() => setActiveMenu(null)}
                      >
                        <MegaMenu item={item as Extract<NavItem, { mega: NonNullable<unknown> }>} onClose={() => setActiveMenu(null)} />
                      </div>
                    ) : null}
                  </div>
                );
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  end={item.to === '/'}
                  onMouseEnter={() => setActiveMenu(null)}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-[13px] font-medium uppercase tracking-nav transition-colors hover:bg-white/10 hover:text-white ${
                      isActive ? 'text-white font-semibold' : 'text-white/85'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 lg:w-[200px] lg:justify-end">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              to="/account"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
              aria-label="Account"
            >
              <User size={20} />
            </Link>
            <Link
              to="/wishlist"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 ? (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-primary-500">
                  {wishlist.length}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 ? (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-primary-500">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div className="border-t border-white/10 bg-primary-500 px-5 py-4 sm:px-8 lg:px-12 animate-fade-in">
            <form
              className="wrap flex gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) {
                  navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
                  setSearchOpen(false);
                  setQuery('');
                }
              }}
            >
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search serums, toners, bundles…"
                className="field flex-1 rounded-full"
                autoFocus
                aria-label="Search products"
              />
              <button type="submit" className="btn bg-white text-primary-500 hover:bg-primary-50 btn-sm">
                Search
              </button>
            </form>
          </div>
        ) : null}
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink/40 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[300px] max-w-[85vw] flex-col bg-primary-500 shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Logo variant="light" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 overflow-y-auto p-4" aria-label="Mobile">
              {NAV.map((item) => {
                if (item.mega) {
                  return (
                    <div key={item.label}>
                      <p className="mb-1 mt-3 px-4 text-[10px] font-bold uppercase tracking-widest text-white/40">{item.label}</p>
                      {item.mega.columns.flatMap((col) => col.items).map((link) => (
                        <Link
                          key={link.to + link.label}
                          to={link.to}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-2xl px-4 py-2.5 text-[13px] font-medium text-white/80 hover:bg-white/10"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  );
                }
                return (
                  <NavLink
                    key={item.to}
                    to={item.to!}
                    end={item.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3 text-[14px] font-semibold uppercase tracking-nav ${
                        isActive ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}
              <div className="my-3 border-t border-white/10" />
              {[
                { to: '/account', label: 'Account' },
                { to: '/wishlist', label: 'Wishlist' },
                { to: '/track-order', label: 'Track Order' },
                { to: '/faqs', label: 'FAQs' },
                { to: '/shipping-returns', label: 'Shipping & Returns' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-[14px] font-medium text-white/70 hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart } = useStore();
  const purchasableLines = cart.filter((l) => l.purchasable && l.price != null);
  const subtotal = purchasableLines.reduce((n, l) => n + (l.price ?? 0) * l.qty, 0);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-ink/40 animate-fade-in" onClick={() => setCartOpen(false)} />
      <div className="absolute right-0 top-0 flex h-full w-[420px] max-w-[92vw] flex-col bg-white shadow-xl animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-ink/5 px-6 py-5">
          <h2 className="text-[16px] font-bold uppercase tracking-nav text-ink">Your Cart</h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-surface-grey"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag size={40} className="text-primary-300" />
            <p className="text-sm text-muted">Your cart is empty. Discover our formulas and curated sets.</p>
            <Link to="/shop" onClick={() => setCartOpen(false)} className="btn btn-primary btn-sm">
              Shop All
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-ink/5 overflow-y-auto px-6">
              {cart.map((line) => (
                <li key={line.key} className="flex gap-4 py-5">
                  <div className="w-16 shrink-0 overflow-hidden rounded-2xl">
                    {line.image ? (
                      <img src={line.image} alt={line.name} className="aspect-[4/5] w-full object-cover" />
                    ) : (
                      <ImagePlaceholder className="aspect-[4/5] w-full" label={line.kind === 'bundle' ? 'Set' : undefined} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Link
                      to={line.kind === 'bundle' ? `/bundles/${line.slug}` : `/products/${line.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="text-[14px] font-semibold text-ink hover:text-primary-500"
                    >
                      {line.name}
                      {line.kind === 'bundle' ? (
                        <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-nav text-primary-500">Set</span>
                      ) : null}
                    </Link>
                    {line.purchasable && line.price != null ? (
                      <p className="text-[13px] font-semibold text-ink">{formatPKR(line.price)}</p>
                    ) : (
                      <p className="text-[12px] font-medium text-warning-600">Awaiting price approval</p>
                    )}
                    <div className="mt-auto flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-ink/10">
                        <button type="button" onClick={() => updateQty(line.key, line.qty - 1)} className="px-3 py-1.5 text-ink hover:text-primary-500" aria-label={`Decrease quantity of ${line.name}`}>
                          −
                        </button>
                        <span className="min-w-6 text-center text-[13px] font-semibold" aria-live="polite">{line.qty}</span>
                        <button type="button" onClick={() => updateQty(line.key, line.qty + 1)} className="px-3 py-1.5 text-ink hover:text-primary-500" aria-label={`Increase quantity of ${line.name}`}>
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(line.key)} className="text-[12px] font-medium text-muted underline-offset-2 hover:text-error-600 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-ink/5 px-6 py-5">
              {subtotal > 0 ? (
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[13px] font-semibold uppercase tracking-nav text-ink">Subtotal</span>
                  <span className="text-[15px] font-bold text-ink">{formatPKR(subtotal)}</span>
                </div>
              ) : null}
              <p className="mb-4 text-[12px] leading-[150%] text-muted">Shipping calculated at checkout. Free delivery on eligible totals above ₨ 5,000.</p>
              <div className="flex gap-3">
                <Link to="/cart" onClick={() => setCartOpen(false)} className="btn btn-secondary flex-1">
                  View Cart
                </Link>
                <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn btn-primary flex-1">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
