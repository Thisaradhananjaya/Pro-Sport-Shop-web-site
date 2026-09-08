import React from 'react';
import { useCart } from '../context/CartContext';

export const Footer = ({ onSelectCategory }) => {
  const { setIsCartOpen, setIsAccountOpen } = useCart();

  return (
    <footer className="footer-section" id="footer-section">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info Column */}
          <div className="footer-brand-col">
            <div
              className="brand-logo"
              onClick={() => {
                onSelectCategory('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="brand-icon">P</div>
              <div className="brand-text">
                PRO<span>SPORT</span>
              </div>
            </div>
            <p className="footer-desc">
              Pro Sport is Sri Lanka's leading premium athletic hub, housing authentic world-class gear and sportswear built to conquer modern sports landscapes.
            </p>
            <div className="social-links">
              {/* X / Twitter */}
              <a href="#x" className="social-icon-btn" aria-label="X">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#facebook" className="social-icon-btn" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5c0-.988.18-1.503 1.488-1.503h2.512V2.012h-3.414c-3.792 0-4.586 2.016-4.586 5.488v2.01H6.198v3.98h3v8.01z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#instagram" className="social-icon-btn" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#youtube" className="social-icon-btn" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">QUICK LINKS</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Home
                </a>
              </li>
              <li className="footer-link-item">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Customer Support Hotline: +94 11 234 5678\nEmail: support@prosport.lk');
                  }}
                >
                  Contact Us
                </a>
              </li>
              <li className="footer-link-item">
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('FAQ: Island-wide delivery takes 1-3 business days across Sri Lanka. Cash on delivery & online payments available.');
                  }}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy Policy */}
          <div>
            <h4 className="footer-col-title">PRIVACY POLICY</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <a href="#dataprotection" onClick={(e) => e.preventDefault()}>Data Protection</a>
              </li>
              <li className="footer-link-item">
                <a href="#cookies" onClick={(e) => e.preventDefault()}>Cookie Policy</a>
              </li>
              <li className="footer-link-item">
                <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Use</a>
              </li>
            </ul>
          </div>

          {/* Sitemap */}
          <div>
            <h4 className="footer-col-title">SITEMAP</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <a
                  href="#homepage"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Homepage
                </a>
              </li>
              <li className="footer-link-item">
                <a
                  href="#products"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Products
                </a>
              </li>
              <li className="footer-link-item">
                <a
                  href="#categories"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Categories
                </a>
              </li>
              <li className="footer-link-item">
                <a
                  href="#cart"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsCartOpen(true);
                  }}
                >
                  Cart
                </a>
              </li>
              <li className="footer-link-item">
                <a
                  href="#account"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAccountOpen(true);
                  }}
                >
                  My Account
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>Copyright © 2026 Pro Sport. All Rights Reserved.</div>
          <div className="payment-badges">
            <span style={{ fontSize: '11px', letterSpacing: '0.05em', color: '#94A3B8' }}>SECURE PAYMENTS:</span>
            <span style={{ fontWeight: 800, color: '#E2E8F0', letterSpacing: '1px' }}>VISA</span>
            <span style={{ fontWeight: 800, color: '#E2E8F0', letterSpacing: '1px' }}>MC</span>
            <span style={{ fontWeight: 800, color: '#E2E8F0', letterSpacing: '1px' }}>AMEX</span>
            <span style={{ fontWeight: 800, color: '#FF5500', letterSpacing: '1px' }}>KOKO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
