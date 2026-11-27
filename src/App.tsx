import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { StoreProvider } from '@/lib/store';
import { Header, CartDrawer } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductPage } from '@/pages/ProductPage';
import { BundlesPage, BundleDetailPage } from '@/pages/BundlesPage';
import { RoutinePage } from '@/pages/RoutinePage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { WishlistPage, AccountPage } from '@/pages/AccountPages';
import {
  AboutPage,
  ContactPage,
  FaqsPage,
  ShippingReturnsPage,
  TrackOrderPage,
  PrivacyPolicyPage,
  TermsPage,
  NotFoundPage,
} from '@/pages/InfoPages';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/bundles" element={<BundlesPage />} />
          <Route path="/bundles/:slug" element={<BundleDetailPage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
