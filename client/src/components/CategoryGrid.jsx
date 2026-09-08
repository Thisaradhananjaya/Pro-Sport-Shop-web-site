import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid = ({ categories = [], onSelectCategory }) => {
  return (
    <section className="category-section" id="categories-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-desc">
            Select high performance sports gear tailored for your specific sport discipline
          </p>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.slug || cat.id}
              className="category-card"
              onClick={() => onSelectCategory(cat.slug || cat.name.toLowerCase())}
            >
              <img
                src={cat.image}
                alt={`${cat.name} sports equipment`}
                className="category-img"
                loading="lazy"
              />
              <div className="category-overlay">
                <span className="category-title">{cat.name}</span>
                <div className="category-arrow-btn">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
