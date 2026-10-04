import React from 'react';
import { CheckCircle, Home, ShoppingBag, ArrowRight } from 'lucide-react';

export const PaymentSuccess = () => {
  // Read any return query params from PayHere if present (e.g. order_id)
  const queryParams = new URLSearchParams(window.location.search);
  const orderId = queryParams.get('order_id') || `PROSPORT-${Date.now().toString().slice(-6)}`;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '520px', width: '100%', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        {/* Large Green Checkmark */}
        <div style={{ width: '88px', height: '88px', backgroundColor: '#10b98115', border: '2px solid #10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={52} style={{ color: '#10b981' }} />
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981', margin: '0 0 12px 0', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          Payment Successful!
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '16px', color: '#9ca3af', margin: '0 0 28px 0' }}>
          Your order has been placed successfully.
        </p>

        {/* Order Details Card */}
        <div style={{ backgroundColor: '#030712', border: '1px solid #1f2937', borderRadius: '10px', padding: '18px 20px', textAlign: 'left', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#9ca3af' }}>
            <span>Order Reference:</span>
            <span style={{ color: '#ff6b00', fontWeight: '700', fontFamily: 'monospace' }}>{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#9ca3af' }}>
            <span>Item:</span>
            <span style={{ color: '#f3f4f6', fontWeight: '600' }}>1x Nike Pegasus 40</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#9ca3af' }}>
            <span>Total Paid:</span>
            <span style={{ color: '#10b981', fontWeight: '700' }}>Rs. 29,500.00 LKR</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#9ca3af', paddingTop: '10px', borderTop: '1px solid #1f2937' }}>
            <span>Payment Method:</span>
            <span style={{ color: '#f3f4f6', fontWeight: '600' }}>PayHere Sandbox</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 24px',
              backgroundColor: '#ff6b00',
              color: '#ffffff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '15px',
              boxShadow: '0 4px 14px rgba(255, 107, 0, 0.35)',
              transition: 'all 0.2s',
            }}
          >
            <Home size={18} />
            <span>Back to Home</span>
          </a>

          <a
            href="/checkout"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            <span>Place another order</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
