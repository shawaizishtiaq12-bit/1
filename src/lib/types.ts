export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price_pkr: number;
  price_approved: boolean;
  stock: number;
  images: string[];
  short_intro: string;
  description: string;
  ingredients: string | null;
  how_to_use: string | null;
  details: string[];
  faqs: { q: string; a: string }[];
  featured: boolean;
  community_favourite: boolean;
  display_order: number;
}

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  price_pkr: number | null;
  price_approved: boolean;
  stock: number;
  images: string[];
  short_intro: string;
  description: string;
  display_order: number;
  items: Product[];
}

export interface CartLineItem {
  key: string;
  kind: 'product' | 'bundle';
  id: string;
  slug: string;
  name: string;
  price: number | null;
  image: string | null;
  qty: number;
  purchasable: boolean;
}

export interface Concern {
  label: string;
  image: string | null;
}

export interface Review {
  id: string;
  product_id: string | null;
  author_name: string;
  rating: number;
  title: string;
  body: string;
  approved: boolean;
  created_at: string;
}

export interface ContentBlocks {
  hero: { headline: string; subheading: string; image: string | null };
  banner: { image: string | null; alt: string };
  brand_story: { heading: string; body: string; image: string | null };
  philosophy: { heading: string; items: string[] };
  routine: { heading: string; body: string };
  concerns: { items: Concern[] };
  gallery: { items: (string | null)[] };
  faqs: { items: { q: string; a: string }[] };
  contact: { email: string | null; phone: string | null; social: { instagram: string | null; facebook: string | null; tiktok: string | null } };
}

export const FALLBACK_BLOCKS: ContentBlocks = {
  hero: { headline: 'Refined Skincare, Made for Pakistan', subheading: 'Seven considered formulas — toners and serums that bring quiet, effective care to your daily routine.', image: null },
  banner: { image: null, alt: 'VELEURA promotional banner' },
  brand_story: { heading: 'The VELEURA Story', body: 'VELEURA began with a simple belief: skincare should feel considered, calm and genuine.', image: null },
  philosophy: { heading: 'Our Product Philosophy', items: [] },
  routine: { heading: 'Build Your Routine', body: 'Answer a few simple questions and we will suggest VELEURA products that fit your skin and your day.' },
  concerns: { items: [] },
  gallery: { items: [] },
  faqs: { items: [] },
  contact: { email: null, phone: null, social: { instagram: null, facebook: null, tiktok: null } },
};
