import logoUrl from './Untitled_design__1_.png-removebg-preview_(1).png';

export function Logo({ className = '' }: { variant?: 'dark' | 'light'; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-label="VELEURA">
      <img src={logoUrl} alt="VELEURA" className="h-9 w-auto object-contain" />
    </span>
  );
}
