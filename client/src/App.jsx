import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentCancel } from './pages/PaymentCancel';
import { CartPage } from './pages/CartPage';
import { Navbar } from './components/Navbar';

import { HeroSection } from './components/HeroSection';
import { TrustedBrands } from './components/TrustedBrands';
import { CategoryGrid } from './components/CategoryGrid';
import { LatestProducts } from './components/LatestProducts';
import { FeaturesBar } from './components/FeaturesBar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { AccountModal } from './components/AccountModal';
import { Toast } from './components/Toast';
import { fetchProducts, fetchCategories } from './services/api';
import { useCart } from './context/CartContext';


export function App() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setQuickViewProduct } = useCart();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleSelectCategory = (catSlug) => {
    setActiveCategory(catSlug);
    setSearchQuery('');
  };

  const handleSelectBrand = (brandName) => {
    setSearchQuery(brandName);
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShopNow = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter products based on activeCategory and searchQuery
  const displayedProducts = products.filter(product => {
    const matchCategory =
      activeCategory === 'home' ||
      product.category.toLowerCase() === activeCategory.toLowerCase();

    const matchSearch =
      searchQuery.trim() === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <Routes>
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />

      <Route
        path="*"
        element={
          <div className="pro-sport-app">
            {/* Header & Subnav */}
            <Navbar
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              products={products}
              onSelectProduct={(p) => setQuickViewProduct(p)}
            />

            {/* Main Home Hero Section */}
            <HeroSection onShopNow={handleShopNow} />

            {/* Light Content Container for Store Sections */}
            <main className="light-section-wrapper">
              {/* Trusted Brands */}
              <TrustedBrands onSelectBrand={handleSelectBrand} />

              {/* Shop by Category */}
              <CategoryGrid
                categories={categories}
                onSelectCategory={handleSelectCategory}
              />

              {/* Latest Products */}
              <LatestProducts
                products={displayedProducts.length > 0 ? displayedProducts : products}
                onSelectCategory={handleSelectCategory}
                activeCategory={activeCategory}
              />

              {/* Feature Highlights Bar */}
              <FeaturesBar />
            </main>

            {/* Dark Footer */}
            <Footer onSelectCategory={handleSelectCategory} />

            {/* Modals & Overlays */}
            <CartDrawer />
            <CheckoutModal />
            <QuickViewModal />
            <AccountModal />
            <Toast />
          </div>
        }
      />
    </Routes>
  );
}


export default App;
