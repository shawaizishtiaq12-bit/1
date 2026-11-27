import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ProductCard, BundleCard } from '@/components/ProductCard';
import { ImagePlaceholder, Reveal, Stars } from '@/components/ui';
import { Section } from '@/components/Section';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Review } from '@/lib/types';

function Banner() {
  const { blocks } = useStore();
  return (
    <section aria-label="Announcement banner" className="bg-white">
      {blocks.banner?.image ? (
        <img src={blocks.banner.image} alt={blocks.banner.alt || 'VELEURA promotional banner'} className="h-[180px] w-full object-cover sm:h-[240px] md:h-[320px]" />
      ) : (
        <ImagePlaceholder label="Announcement banner image slot — replaceable" className="h-[180px] w-full sm:h-[240px] md:h-[320px]" tone="cyan" />
      )}
    </section>
  );
}

function Hero() {
  const { blocks } = useStore();
  return (
    <section className="bg-white">
      <div className="wrap flex flex-col items-center px-5 py-14 text-center sm:px-8 md:py-20 lg:px-12">
        <p className="eyebrow mb-4 animate-fade-up">VELEURA · Premium Skincare</p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[120%] text-ink animate-fade-up md:text-[54px]" style={{ animationDelay: '80ms' }}>
          {blocks.hero?.headline ?? 'Refined Skincare, Made for Pakistan'}
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-[150%] text-muted animate-fade-up" style={{ animationDelay: '160ms' }}>
          {blocks.hero?.subheading}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-up" style={{ animationDelay: '240ms' }}>
          <Link to="/shop" className="btn btn-primary">
            Shop Now <ArrowRight size={16} />
          </Link>
          <Link to="/bundles" className="btn btn-secondary">
            Discover Bundles
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          product={{ ...p, price: p.price_pkr, image: p.images?.[0] ?? null, purchasable: p.price_approved }}
          delay={i * 50}
        />
      ))}
    </div>
  );
}

function ShopByConcern() {
  const { blocks } = useStore();
  const items = blocks.concerns?.items ?? [];
  return (
    <Section eyebrow="Find Your Focus" title="Shop by Skincare Concern" tone="grey">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {items.map((c, i) => (
          <Reveal key={c.label} delay={i * 70}>
            <Link
              to={`/shop?concern=${encodeURIComponent(c.label)}`}
              className="group relative block overflow-hidden rounded-3xl"
            >
              {c.image ? (
                <img src={c.image} alt={c.label} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <ImagePlaceholder label={c.label} className="aspect-[4/5] w-full" tone={i % 2 ? 'cyan' : 'mint'} />
              )}
              <span className="absolute inset-x-4 bottom-4 rounded-full bg-white/90 px-5 py-2.5 text-center text-[13px] font-semibold text-ink backdrop-blur-sm transition-colors group-hover:bg-primary-500 group-hover:text-white">
                {c.label}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function EditorialSplit({
  eyebrow,
  heading,
  body,
  image,
  cta,
  reverse = false,
  tone = 'white',
}: {
  eyebrow: string;
  heading: string;
  body: string;
  image: string | null;
  cta?: { label: string; to: string };
  reverse?: boolean;
  tone?: 'white' | 'mint' | 'grey';
}) {
  const tones: Record<string, string> = {
    white: 'bg-white',
    mint: 'bg-surface-mint',
    grey: 'bg-surface-grey',
  };
  return (
    <Section tone={tone}>
      <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? 'lg:[direction:rtl]' : ''}`}>
        <div className="lg:[direction:ltr]">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="text-2xl font-bold text-ink md:text-[32px]">{heading}</h2>
          <p className="mt-4 max-w-lg text-[14px] leading-[150%] text-muted">{body}</p>
          {cta ? (
            <Link to={cta.to} className="btn btn-secondary mt-7">
              {cta.label} <ArrowRight size={15} />
            </Link>
          ) : null}
        </div>
        <div className="lg:[direction:ltr]">
          {image ? (
            <img src={image} alt={heading} loading="lazy" className="aspect-[5/4] w-full rounded-[2rem] object-cover shadow-md" />
          ) : (
            <ImagePlaceholder label={`${eyebrow} image slot — replaceable`} className="aspect-[5/4] w-full rounded-[2rem] shadow-md" tone="grey" />
          )}
        </div>
      </div>
    </Section>
  );
}

function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false }).limit(6);
      if (active) setReviews((data ?? []) as Review[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  const empty = reviews != null && reviews.length === 0;
  return (
    <Section eyebrow="Real Experiences" title="Customer Reviews" tone="mint">
      {empty ? (
        <p className="max-w-xl text-[14px] leading-[150%] text-muted">
          We only publish genuine, verified customer reviews. As VELEURA orders begin, real reviews will appear here — never fabricated testimonials.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(reviews ?? []).map((r, i) => (
            <Reveal key={r.id} delay={i * 60}>
              <figure className="flex h-full flex-col gap-3 rounded-3xl border border-ink/5 bg-white p-6">
                <Stars rating={r.rating} />
                {r.title ? <figcaption className="text-[15px] font-semibold text-ink">{r.title}</figcaption> : null}
                <blockquote className="text-[13px] leading-[150%] text-muted">{r.body}</blockquote>
                <p className="mt-auto text-[12px] font-semibold uppercase tracking-nav text-muted">{r.author_name}</p>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

function InstagramGallery() {
  const { blocks } = useStore();
  const items = blocks.gallery?.items ?? [];
  return (
    <Section eyebrow="@veleura.pk" title="Follow Our Visual Journal" tone="white">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((img, i) =>
          img ? (
            <img key={i} src={img} alt={`VELEURA visual ${i + 1}`} loading="lazy" className="aspect-square w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.03]" />
          ) : (
            <ImagePlaceholder key={i} label="Gallery slot" className="aspect-square w-full rounded-2xl" tone={i % 3 === 0 ? 'mint' : i % 3 === 1 ? 'cyan' : 'grey'} />
          ),
        )}
      </div>
    </Section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    setState('saving');
    const { error } = await supabase.from('newsletter_signups').insert({ email: email.trim().toLowerCase() });
    if (error) {
      if (error.code === '23505') {
        setState('done');
        return;
      }
      setState('error');
      return;
    }
    setState('done');
  };

  return (
    <section className="section-pad bg-primary-500 text-white">
      <div className="wrap mx-auto flex max-w-2xl flex-col items-center text-center">
        <Mail size={28} className="mb-4 text-white/80" aria-hidden="true" />
        <h2 className="text-2xl font-bold md:text-[32px]">Join the VELEURA List</h2>
        <p className="mt-3 max-w-md text-[14px] leading-[150%] text-white/70">
          Be first to hear about launches, restocks and considered skincare guidance. Unsubscribe anytime.
        </p>
        {state === 'done' ? (
          <p className="mt-6 rounded-full bg-white/15 px-6 py-3 text-[13px] font-semibold">Thank you — you are on the list.</p>
        ) : (
          <form onSubmit={submit} className="mt-7 w-full max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/50 focus:border-white"
              />
              <button type="submit" disabled={state === 'saving'} className="btn bg-white text-primary-500 hover:bg-primary-50">
                {state === 'saving' ? 'Joining…' : 'Subscribe'}
              </button>
            </div>
            <label className="mt-4 flex items-start justify-center gap-2 text-left text-[12px] leading-[150%] text-white/60">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-0.5" />
              I agree to receive VELEURA emails and have read the{' '}
              <Link to="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
              .
            </label>
            {state === 'error' ? <p className="mt-3 text-[13px] text-white">Something went wrong — please try again.</p> : null}
          </form>
        )}
      </div>
    </section>
  );
}

export function HomePage() {
  const { products, bundles, blocks, loading, error } = useStore();
  const bestsellers = products.filter((p) => p.featured).slice(0, 6);
  const favourites = products.filter((p) => p.community_favourite);
  const philosophy = blocks.philosophy?.items ?? [];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted">Loading VELEURA…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <p className="text-sm text-error-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Banner />
      <Hero />

      <Section
        eyebrow="Bestsellers"
        title="Featured Products"
        intro="Our most-loved formulas, each crafted for a purpose in your routine."
        action={
          <Link to="/shop" className="btn btn-ghost btn-sm">
            View All <ArrowRight size={14} />
          </Link>
        }
      >
        <FeaturedGrid products={bestsellers} />
      </Section>

      <Section
        eyebrow="Curated Sets"
        title="Explore Our Bundles"
        intro="Complete routines, thoughtfully paired. Prices appear once approved."
        action={
          <Link to="/bundles" className="btn btn-ghost btn-sm">
            All Bundles <ArrowRight size={14} />
          </Link>
        }
        tone="mint"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {bundles.map((b, i) => (
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
              delay={i * 80}
            />
          ))}
        </div>
      </Section>

      <ShopByConcern />

      <Section eyebrow="Loved by the Community" title="Community Favourites" tone="grey">
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {favourites.map((p, i) => (
            <ProductCard key={p.id} product={{ ...p, price: p.price_pkr, image: p.images?.[0] ?? null, purchasable: p.price_approved }} delay={i * 50} />
          ))}
        </div>
      </Section>

      <EditorialSplit
        eyebrow="Our Story"
        heading={blocks.brand_story?.heading ?? 'The VELEURA Story'}
        body={blocks.brand_story?.body ?? ''}
        image={blocks.brand_story?.image ?? null}
        cta={{ label: 'About Us', to: '/about' }}
        tone="grey"
      />

      <Section eyebrow="What Guides Us" title={blocks.philosophy?.heading ?? 'Our Product Philosophy'} tone="white">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {philosophy.map((item, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="h-full rounded-3xl border border-ink/5 bg-surface-grey p-7">
                <span className="text-[13px] font-bold text-primary-300">0{i + 1}</span>
                <p className="mt-3 text-[14px] font-semibold leading-[150%] text-ink">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CustomerReviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
