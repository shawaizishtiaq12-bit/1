import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '@/lib/store';

export function Footer() {
  const { blocks } = useStore();
  const social = blocks.contact?.social ?? {};

  return (
    <footer className="bg-primary-500 text-white">
      <div className="wrap grid gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
        <div className="flex flex-col gap-4">
          <Logo variant="light" />
          <p className="max-w-xs text-[13px] leading-[150%] text-white/70">
            Premium skincare, considered for Pakistan. Toners, serums and curated sets for a refined daily routine.
          </p>
          <div className="flex gap-3 pt-1">
            {social.instagram ? (
              <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                <Instagram size={18} />
              </a>
            ) : null}
            {social.facebook ? (
              <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                <Facebook size={18} />
              </a>
            ) : null}
          </div>
        </div>

        <nav aria-label="Shop">
          <h3 className="mb-4 text-[13px] font-bold uppercase tracking-nav text-white">Shop</h3>
          <ul className="flex flex-col gap-2.5 text-[13px] text-white/70">
            <li><Link className="transition-colors hover:text-white" to="/shop">Shop All</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/shop?category=serum">Serums</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/shop?category=toner">Toners</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/bundles">Bundles</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/routine">Skincare Routine</Link></li>
          </ul>
        </nav>

        <nav aria-label="Customer support">
          <h3 className="mb-4 text-[13px] font-bold uppercase tracking-nav text-white">Support</h3>
          <ul className="flex flex-col gap-2.5 text-[13px] text-white/70">
            <li><Link className="transition-colors hover:text-white" to="/contact">Contact Us</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/faqs">FAQs</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/shipping-returns">Shipping & Returns</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/track-order">Track Order</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/account">Account</Link></li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h3 className="mb-4 text-[13px] font-bold uppercase tracking-nav text-white">Company</h3>
          <ul className="flex flex-col gap-2.5 text-[13px] text-white/70">
            <li><Link className="transition-colors hover:text-white" to="/about">About Us</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/terms">Terms & Conditions</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-2 px-5 py-6 text-[12px] text-white/50 sm:flex-row sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} VELEURA. All rights reserved.</p>
          <p>Delivering across Pakistan · Prices in Pakistani Rupees</p>
        </div>
      </div>
    </footer>
  );
}
