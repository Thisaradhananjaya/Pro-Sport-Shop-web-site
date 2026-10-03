import React, { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, X, Menu, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen]         = useState(false);
  const searchRef  = useRef(null);
  const userMenuRef = useRef(null);

  /* Filter search matches for quick dropdown */
  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    window.location.href = '/';
  };

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
            {isAuthenticated ? (
              /* ─── Logged-in user menu ─── */
              <div className="nav-user-menu" ref={userMenuRef}>
                <button
                  type="button"
                  id="nav-user-btn"
                  className={`account-btn account-btn--active ${isAdmin ? 'account-btn--admin' : ''}`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {isAdmin ? <Shield size={15} /> : <User size={15} />}
                  <span className="nav-user-name">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={13} className={`nav-chevron ${userMenuOpen ? 'nav-chevron--open' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="nav-user-dropdown" role="menu">
                    <div className="nav-user-info">
                      <div className="nav-user-avatar">
                        {isAdmin ? <Shield size={14} /> : user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="nav-user-fullname">{user.name}</div>
                        <div className="nav-user-email">{user.email}</div>
                        <div className={`nav-user-role-badge ${isAdmin ? 'nav-user-role-badge--admin' : ''}`}>
                          {isAdmin ? '⚙ Admin' : '👤 Customer'}
                        </div>
                      </div>
                    </div>

                    <div className="nav-user-divider" />

                    {isAdmin && (
                      <a
                        href="/admin/dashboard"
                        className="nav-user-item nav-user-item--admin"
                        role="menuitem"
                      >
                        <Shield size={14} />
                        Admin Dashboard
                      </a>
                    )}

                    {!isAdmin && (
                      <button
                        type="button"
                        className="nav-user-item"
                        role="menuitem"
                        onClick={() => { setUserMenuOpen(false); setIsAccountOpen(true); }}
                      >
                        <User size={14} />
                        My Account
                      </button>
                    )}

                    <div className="nav-user-divider" />

                    <button
                      id="nav-logout-btn"
                      type="button"
                      className="nav-user-item nav-user-item--logout"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ─── Guest account button ─── */
              <button
                type="button"
                className="account-btn"
                onClick={() => window.location.href = '/login'}
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}

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
