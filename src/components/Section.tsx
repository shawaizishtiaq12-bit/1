import type { ReactNode } from 'react';

export function PageHero({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <section className="bg-surface-mint">
      <div className="wrap px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        {eyebrow ? <p className="eyebrow mb-3 animate-fade-up">{eyebrow}</p> : null}
        <h1 className="max-w-3xl text-3xl font-extrabold text-ink animate-fade-up md:text-[44px]" style={{ animationDelay: '80ms' }}>
          {title}
        </h1>
        {intro ? (
          <p className="mt-4 max-w-2xl text-[15px] leading-[150%] text-muted animate-fade-up" style={{ animationDelay: '160ms' }}>
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function Section({
  eyebrow,
  title,
  intro,
  action,
  children,
  tone = 'white',
  id,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: 'white' | 'mint' | 'grey' | 'cyan';
  id?: string;
}) {
  const tones: Record<string, string> = {
    white: 'bg-white',
    mint: 'bg-surface-mint',
    grey: 'bg-surface-grey',
    cyan: 'bg-surface-cyan',
  };
  return (
    <section id={id} className={`${tones[tone]} section-pad`}>
      <div className="wrap">
        {title || action ? (
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
              {title ? <h2 className="max-w-xl text-2xl font-bold text-ink md:text-[32px]">{title}</h2> : null}
              {intro ? <p className="mt-2 max-w-xl text-[14px] leading-[150%] text-muted">{intro}</p> : null}
            </div>
            {action}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
