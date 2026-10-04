import React from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';

export const CartPage = () => {
  const item = {
    title: 'Nike Pegasus 40 Running Shoes',
    tag: 'Athletic Footwear • Size UK 9 • Black/Orange',
    price: 29500,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#f9fafb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1f2937', backgroundColor: '#0b0f19', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}
          >
            <ArrowLeft size={18} />
            <span>Continue Shopping</span>
          </a>
          <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#ffffff' }}>PRO</span>
            <span style={{ color: '#ff6b00' }}>SPORT</span>
          </div>
          <div style={{ width: '80px' }}></div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <ShoppingBag size={28} style={{ color: '#ff6b00' }} />
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
            Your Shopping Cart (1)
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
          {/* Cart Item List */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', gap: '18px', paddingBottom: '20px', borderBottom: '1px solid #1f2937' }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #374151' }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: '0 0 6px 0' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                    {item.tag}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    Qty: <strong style={{ color: '#ffffff' }}>{item.quantity}</strong>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#ff6b00' }}>
                    Rs. 29,500.00
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '13px', marginTop: '16px' }}>
              <ShieldCheck size={16} />
              <span>In stock & ready for immediate dispatch</span>
            </div>
          </div>

          {/* Cart Summary */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff', margin: '0 0 16px 0', borderBottom: '1px solid #1f2937', paddingBottom: '12px' }}>
              Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9ca3af' }}>
                <span>Subtotal</span>
                <span>Rs. 29,500.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9ca3af' }}>
                <span>Standard Delivery</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: '#ffffff', paddingTop: '12px', borderTop: '1px solid #1f2937' }}>
                <span>Total</span>
                <span style={{ color: '#ff6b00' }}>Rs. 29,500.00</span>
              </div>
            </div>

            <a
              href="/checkout"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                boxSizing: 'border-box',
                padding: '14px 20px',
                backgroundColor: '#ff6b00',
                color: '#ffffff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '15px',
                boxShadow: '0 4px 14px rgba(255, 107, 0, 0.4)',
                textAlign: 'center',
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
