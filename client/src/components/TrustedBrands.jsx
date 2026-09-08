import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { trustedBrands } from '../data/mockData';

export const TrustedBrands = ({ onSelectBrand }) => {
  return (
    <section className="brands-section">
      <div className="container">
        <h3 className="section-label-small">TRUSTED BRANDS</h3>
        <div className="brands-grid">
          {trustedBrands.map((brand) => (
            <div
              key={brand.id}
              className="brand-card"
              onClick={() => onSelectBrand && onSelectBrand(brand.name)}
              title={`Filter by ${brand.name}`}
              style={{ cursor: 'pointer' }}
            >
              <span className="brand-logo-text">
                <span style={{ marginRight: '6px', fontSize: '16px' }}>{brand.icon}</span>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
