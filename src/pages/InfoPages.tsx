import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, PackageSearch, Phone } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PageHero, Section } from '@/components/Section';
import { TemporaryNote } from '@/components/ui';

export function AboutPage() {
  const { blocks } = useStore();
  return (
    <>
      <PageHero eyebrow="Our Brand" title="About VELEURA" intro="Considered skincare, made for Pakistan." />
      <Section tone="white">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-3">Brand Story</p>
            <h2 className="text-2xl font-bold text-ink md:text-[32px]">{blocks.brand_story?.heading ?? 'The VELEURA Story'}</h2>
            <p className="mt-4 max-w-lg text-[14px] leading-[150%] text-muted">{blocks.brand_story?.body}</p>
          </div>
          <div className="aspect-[5/4] w-full rounded-[2rem] bg-surface-mint" aria-label="Brand image placeholder" />
        </div>
      </Section>
      <Section tone="mint">
        <div className="grid gap-5 sm:grid-cols-2">
          {(blocks.philosophy?.items ?? []).map((item, i) => (
            <div key={i} className="rounded-3xl border border-ink/5 bg-white p-7">
              <span className="text-[13px] font-bold text-primary-300">0{i + 1}</span>
              <p className="mt-3 text-[14px] font-semibold leading-[150%] text-ink">{item}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

export function ContactPage() {
  const { blocks } = useStore();
  const [sent, setSent] = useState(false);
  const contact = blocks.contact ?? { email: null, phone: null, social: { instagram: null, facebook: null, tiktok: null } };

  return (
    <>
      <PageHero eyebrow="Get in Touch" title="Contact Us" intro="Questions about products, your order or your skin? We would love to hear from you." />
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {sent ? (
            <div className="flex flex-col items-start gap-4 rounded-3xl bg-surface-mint p-10">
              <h2 className="text-xl font-bold text-ink">Message received</h2>
              <p className="text-[14px] leading-[150%] text-muted">Thank you for reaching out — the VELEURA team will reply as soon as possible.</p>
              <button type="button" onClick={() => setSent(false)} className="btn btn-secondary btn-sm">Send another</button>
            </div>
          ) : (
            <form
              className="grid gap-5 sm:grid-cols-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                setSent(true);
                form.reset();
                void data;
              }}
            >
              <div>
                <label className="field-label" htmlFor="ct-name">Name</label>
                <input id="ct-name" name="name" required className="field" placeholder="Your name" />
              </div>
              <div>
                <label className="field-label" htmlFor="ct-email">Email</label>
                <input id="ct-email" name="email" type="email" required className="field" placeholder="you@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="ct-msg">Message</label>
                <textarea id="ct-msg" name="message" required rows={6} className="field" placeholder="How can we help?" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn btn-primary">Send Message</button>
              </div>
            </form>
          )}
          <aside className="flex h-fit flex-col gap-5 rounded-3xl border border-ink/5 bg-surface-grey p-7">
            <h2 className="text-[15px] font-bold uppercase tracking-nav text-ink">Reach Us Directly</h2>
            <p className="flex items-center gap-3 text-[13px] text-ink">
              <Mail size={16} className="text-primary-500" />
              {contact.email ?? 'Email address coming soon'}
            </p>
            <p className="flex items-center gap-3 text-[13px] text-ink">
              <Phone size={16} className="text-primary-500" />
              {contact.phone ?? 'Phone number coming soon'}
            </p>
            <p className="flex items-center gap-3 text-[13px] text-ink">
              <MapPin size={16} className="text-primary-500" />
              Delivering across Pakistan
            </p>
            <TemporaryNote>Contact details will be confirmed and displayed here once approved by the owner.</TemporaryNote>
          </aside>
        </div>
      </Section>
    </>
  );
}

export function FaqsPage() {
  const { blocks } = useStore();
  const items = blocks.faqs?.items ?? [];
  return (
    <>
      <PageHero eyebrow="Support" title="Frequently Asked Questions" intro="Everything you need to know about shopping with VELEURA." />
      <Section tone="white">
        <div className="wrap max-w-3xl">
          {items.length === 0 ? (
            <p className="text-sm text-muted">Questions and answers will appear here once approved.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((f, i) => (
                <details key={i} className="group rounded-3xl border border-ink/5 bg-surface-grey px-6 py-5 open:bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink">
                    {f.q}
                    <span className="text-primary-500 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-[14px] leading-[150%] text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

export function ShippingReturnsPage() {
  return (
    <>
      <PageHero eyebrow="Support" title="Shipping & Returns" intro="Pakistan-specific delivery and return information." />
      <Section tone="white">
        <div className="wrap max-w-3xl flex flex-col gap-10">
          <div>
            <h2 className="mb-3 text-xl font-bold text-ink">Shipping</h2>
            <ul className="list-disc space-y-2 pl-5 text-[14px] leading-[150%] text-muted">
              <li>We deliver nationwide across Pakistan.</li>
              <li>Free shipping applies when your eligible product total is strictly greater than ₨ 5,000.</li>
              <li>Totals of ₨ 5,000 or less do not qualify — for example, a ₨ 5,000 order does not qualify, while ₨ 5,001 does.</li>
              <li>The delivery fee for orders below the free-shipping threshold will be confirmed here as soon as it is set. It is never estimated or invented.</li>
              <li>Shipping eligibility refreshes automatically when your cart changes.</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-bold text-ink">Returns</h2>
            <p className="max-w-xl text-[14px] leading-[150%] text-muted">
              Our full Pakistan-specific returns policy will be published here once approved by the owner. For any question about a delivery, please reach us via the{' '}
              <Link to="/contact" className="font-semibold text-primary-500 underline underline-offset-2">contact page</Link>.
            </p>
          </div>
          <TemporaryNote>Policy details are editable and will be completed with owner-approved content.</TemporaryNote>
        </div>
      </Section>
    </>
  );
}

export function TrackOrderPage() {
  return (
    <>
      <PageHero eyebrow="Support" title="Track Your Order" intro="Live order tracking arrives with our courier integration and secure customer accounts." />
      <Section tone="white">
        <div className="wrap max-w-xl">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-ink/5 bg-surface-grey p-10 text-center">
            <PackageSearch size={36} className="text-primary-300" />
            <h2 className="text-lg font-bold text-ink">Tracking opens soon</h2>
            <p className="text-[14px] leading-[150%] text-muted">
              For your security, order details are only ever available to the authenticated customer — an email address or order number alone never grants access.
              As soon as account sign-in and our courier integration are live, you will be able to follow every delivery here.
            </p>
            <Link to="/contact" className="btn btn-secondary btn-sm">Contact Support</Link>
          </div>
        </div>
      </Section>
    </>
  );
}

export function SimplePage({ title, intro, paragraphs, revision }: { title: string; intro: string; paragraphs: string[]; revision?: string }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} intro={intro} />
      <Section tone="white">
        <div className="wrap max-w-3xl flex flex-col gap-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[14px] leading-[150%] text-muted">{p}</p>
          ))}
          <TemporaryNote>
            {revision ?? 'This page will be completed with owner-approved legal content.'}
          </TemporaryNote>
        </div>
      </Section>
    </>
  );
}

export function PrivacyPolicyPage() {
  return (
    <SimplePage
      title="Privacy Policy"
      intro="How VELEURA collects, uses and protects your information."
      paragraphs={[
        'VELEURA respects your privacy. When you shop with us or subscribe to our emails, we collect only the information needed to take your order, deliver it and keep you informed — such as your name, contact details and delivery address.',
        'Newsletter subscriptions are used solely to send VELEURA updates, and every email includes a way to unsubscribe. Consent is requested explicitly before you are added to the list.',
        'We never sell your personal information. Payment details are handled only by our approved payment providers.',
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <SimplePage
      title="Terms & Conditions"
      intro="The terms that govern your use of VELEURA.pk and purchases from VELEURA."
      paragraphs={[
        'By using VELEURA.pk you agree to these terms. Product information is provided for general guidance; always read packaging before use and patch-test new skincare products.',
        'Prices are shown in Pakistani Rupees. Order acceptance, delivery and returns are subject to our published Shipping & Returns policy.',
        'These terms will be completed with the full owner-approved legal text.',
      ]}
    />
  );
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="text-3xl font-extrabold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
