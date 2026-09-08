import React, { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, X, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { id: 'home', label: 'HOME' },
  { id: 'cricket', label: 'CRICKET' },
  { id: 'fitness', label: 'FITNESS' },
  { id: 'football', label: 'FOOTBALL' },
  { id: 'badminton', label: 'BADMINTON' },
  { id: 'running', label: 'RUNNING' },
  { id: 'apparel', label: 'APPAREL' },
  { id: 'contact', label: 'CONTACT' },
];

export const Navbar = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  products = [],
  onSelectProduct
}) => {
  const { cartCount, setIsCartOpen, setIsAccountOpen, formatPrice } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  // Filter search matches for quick dropdown
  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header-wrapper">
      <div className="container">
        {/* Top Header Row */}
        <div className="header-top">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => onSelectCategory('home')}>
            <div className="brand-icon">P</div>
            <div className="brand-text">
              PRO<span>SPORT</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="search-container" ref={searchRef}>
            <div className="search-input-wrapper">
              <div className="search-icon-prefix">
                <Menu size={16} />
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search equipment, brands, sports gear..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    onSearchChange('');
                    setIsDropdownOpen(false);
                  }}
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
              <button
                type="button"
                className="search-action-btn"
                onClick={() => {
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Search size={16} />
              </button>
            </div>

            {/* Quick Live Search Results */}
            {isDropdownOpen && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map(item => (
                  <div
                    key={item.id || item._id}
                    className="search-result-item"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (onSelectProduct) onSelectProduct(item);
                    }}
                  >
                    <img src={item.image} alt={item.title} className="search-result-img" />
                    <div className="search-result-info">
                      <div className="search-result-category">{item.category}</div>
                      <div className="search-result-title">{item.title}</div>
                    </div>
                    <div className="search-result-price">{formatPrice(item.price)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Account & Cart Button */}
          <div className="header-actions">
            <button
              type="button"
              className="account-btn"
              onClick={() => setIsAccountOpen(true)}
            >
              <User size={16} />
              <span>Account</span>
            </button>

            <button
              type="button"
              className="cart-btn"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={17} />
              <span>Cart ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="sub-nav">
          {NAV_LINKS.map(link => {
            const isActive = activeCategory.toLowerCase() === link.id.toLowerCase();
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory(link.id);
                  if (link.id !== 'home' && link.id !== 'contact') {
                    const el = document.getElementById('products-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else if (link.id === 'contact') {
                    const el = document.getElementById('footer-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
