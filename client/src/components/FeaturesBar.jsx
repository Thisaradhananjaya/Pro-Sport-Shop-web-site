import React from 'react';
import { Truck, Headphones, ShieldCheck, Percent } from 'lucide-react';

const FEATURES = [
  {
    id: 1,
    title: 'Island-wide Delivery',
    desc: 'Fast, reliable door-to-door transit',
    icon: Truck,
  },
  {
    id: 2,
    title: '24/7 Support',
    desc: 'Dedicated elite sport experts',
    icon: Headphones,
  },
  {
    id: 3,
    title: 'Secure Payments',
    desc: '100% verified SSL checkout',
    icon: ShieldCheck,
  },
  {
    id: 4,
    title: 'Weekly Sales',
    desc: 'Massive athletic season deals',
    icon: Percent,
  },
];

export const FeaturesBar = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="feature-card">
                <div className="feature-icon-box">
                  <Icon size={22} />
                </div>
                <div>
                  <h5 className="feature-title">{item.title}</h5>
                  <p className="feature-desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
