import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection = ({ onShopNow }) => {
  return (
    <section className="hero-section">
      {/* Background Stadium Runner Image */}
      <img
        src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1920&q=80"
        alt="Track athlete at starting blocks under stadium floodlights"
        className="hero-background"
      />
      
      {/* Dark & dynamic gradient overlay */}
      <div className="hero-overlay" />

      <div className="container">
        <div className="hero-content">
          {/* Tag / Badge */}
          <div className="hero-badge">
            <Sparkles size={13} style={{ color: '#FF7733' }} />
            <span>NEW ARRIVALS 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            GEAR UP FOR<br />GREATNESS
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Unleash your true athletic potential. Discover premium quality gear engineered for professionals and built for champions.
          </p>

          {/* CTA Button */}
          <button
            type="button"
            className="hero-cta-btn"
            onClick={onShopNow}
          >
            <span>SHOP NOW</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};
