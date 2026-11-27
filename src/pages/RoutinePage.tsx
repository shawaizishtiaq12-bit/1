import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { PageHero } from '@/components/Section';

const STEPS = [
  {
    key: 'type',
    question: 'How would you describe your skin?',
    options: ['Dry', 'Oily', 'Combination', 'Normal'],
  },
  {
    key: 'goal',
    question: 'What would you like your routine to focus on?',
    options: ['Hydration', 'Oil & Blemishes', 'Radiance', 'Even Tone'],
  },
  {
    key: 'experience',
    question: 'How experienced are you with actives?',
    options: ['Just starting', 'Comfortable', 'Very experienced'],
  },
];

const GOAL_MATCH: Record<string, (name: string) => boolean> = {
  Hydration: (n) => /hydrat|hylauron/i.test(n),
  'Oil & Blemishes': (n) => /salicyl|niacinam|retinol/i.test(n),
  Radiance: (n) => /vitamin c|glutathione/i.test(n),
  'Even Tone': (n) => /niacinam|glutathione|vitamin c/i.test(n),
};

export function RoutinePage() {
  const { products } = useStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const recommended = useMemo(() => {
    const goal = answers.goal ?? '';
    const matcher = GOAL_MATCH[goal];
    const scored = products.map((p) => ({
      p,
      score: (matcher ? (matcher(p.name) ? 2 : 0) : 0) + (answers.type === 'Dry' && /hydrat|hylauron/i.test(p.name) ? 1 : 0) + (answers.type === 'Oily' && /salicyl|niacinam/i.test(p.name) ? 1 : 0),
    }));
    scored.sort((a, b) => b.score - a.score || a.p.display_order - b.p.display_order);
    return scored.slice(0, 4).map((s) => ({
      ...s.p,
      price: s.p.price_pkr,
      image: s.p.images?.[0] ?? null,
      purchasable: s.p.price_approved,
    }));
  }, [products, answers]);

  const pick = (key: string, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step + 1 < STEPS.length) setStep(step + 1);
    else setDone(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Discovery Tool"
        title="Build Your Routine"
        intro="Answer a few simple questions and we will suggest VELEURA products that fit your skin and your day. This tool is for general product discovery — it is not medical advice or a diagnosis."
      />
      <section className="section-pad bg-white">
        <div className="wrap max-w-2xl">
          {!done ? (
            <div>
              <div className="mb-8 flex items-center gap-2" aria-hidden="true">
                {STEPS.map((s, i) => (
                  <span
                    key={s.key}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary-500' : 'bg-surface-grey'}`}
                  />
                ))}
              </div>
              <p className="eyebrow mb-2">Question {step + 1} of {STEPS.length}</p>
              <h2 className="mb-7 text-2xl font-bold text-ink">{STEPS[step].question}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {STEPS[step].options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => pick(STEPS[step].key, opt)}
                    className="group flex items-center justify-between rounded-2xl border border-ink/10 bg-white px-6 py-5 text-left text-[15px] font-semibold text-ink transition-all hover:border-primary-500 hover:bg-primary-50"
                  >
                    {opt}
                    <ArrowRight size={16} className="text-primary-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-500" />
                  </button>
                ))}
              </div>
              {step > 0 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="mt-6 text-[13px] font-medium text-muted underline underline-offset-2 hover:text-primary-500">
                  Back
                </button>
              ) : null}
            </div>
          ) : (
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-success-50 px-4 py-2 text-[12px] font-semibold uppercase tracking-nav text-success-600">
                <Check size={14} /> Your routine overview
              </p>
              <h2 className="mt-5 text-2xl font-bold text-ink">
                A {answers.goal?.toLowerCase()} focus for {answers.type?.toLowerCase()} skin
              </h2>
              <p className="mt-3 max-w-xl text-[14px] leading-[150%] text-muted">
                Based on your answers, these VELEURA formulas are a good place to start. Introduce one product at a time, and patch-test before first use
                {answers.experience === 'Just starting' ? ' — especially with active ingredients like retinol, which is best introduced gradually.' : '.'}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {recommended.map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={i * 60} />
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/shop" className="btn btn-primary">Shop All Products</Link>
                <button type="button" onClick={() => { setStep(0); setAnswers({}); setDone(false); }} className="btn btn-secondary">
                  Retake Questions
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
