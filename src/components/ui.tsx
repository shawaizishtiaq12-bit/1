import type { ReactNode } from 'react';

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`animate-fade-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ImagePlaceholder({
  label,
  className = '',
  tone = 'mint',
}: {
  label?: string;
  className?: string;
  tone?: 'mint' | 'cyan' | 'grey';
}) {
  const tones: Record<string, string> = {
    mint: 'from-primary-50 to-surface-cyan',
    cyan: 'from-surface-cyan to-surface-grey',
    grey: 'from-surface-grey to-primary-50',
  };
  return (
    <div
      className={`placeholder-shimmer flex items-center justify-center bg-gradient-to-br ${tones[tone]} ${className}`}
      role="img"
      aria-label={label ?? 'Product image placeholder'}
    >
      <div className="flex flex-col items-center gap-2 text-primary-400/70">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 3h6" />
          <path d="M10 3v4.5L6.8 13a5.5 5.5 0 1 0 10.4 0L14 7.5V3" />
          <path d="M7.5 15h9" />
        </svg>
        {label ? <span className="px-4 text-center text-[10px] font-semibold uppercase tracking-nav">{label}</span> : null}
      </div>
    </div>
  );
}

export function PriceTag({
  price,
  approved,
  className = '',
}: {
  price: number | null;
  approved: boolean;
  className?: string;
}) {
  if (!approved || price == null) {
    return (
      <span className={`text-[13px] font-semibold uppercase tracking-nav text-muted ${className}`}>
        Price to be confirmed
      </span>
    );
  }
  return <span className={`text-[15px] font-semibold text-ink ${className}`}>₨ {price.toLocaleString('en-PK')}</span>;
}

export function TemporaryNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-warning-600/25 bg-warning-50 px-4 py-3 text-[13px] leading-[150%] text-warning-600">
      {children}
    </p>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-warning-600" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}
