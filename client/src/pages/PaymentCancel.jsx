import React from 'react';
import { XCircle, RefreshCw, Home, AlertTriangle } from 'lucide-react';

export const PaymentCancel = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '520px', width: '100%', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        {/* Large Red X */}
        <div style={{ width: '88px', height: '88px', backgroundColor: '#ef444415', border: '2px solid #ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <XCircle size={52} style={{ color: '#ef4444' }} />
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ef4444', margin: '0 0 12px 0', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          Payment Cancelled
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '16px', color: '#9ca3af', margin: '0 0 28px 0' }}>
          Your payment was not completed.
        </p>

        {/* Notice Card */}
        <div style={{ backgroundColor: '#030712', border: '1px solid #1f2937', borderRadius: '10px', padding: '18px 20px', textAlign: 'left', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.5 }}>
              No funds were deducted from your account. You can re-attempt the checkout anytime with your card or alternative payment methods.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a
            href="/checkout"
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
            <RefreshCw size={18} />
            <span>Try Again</span>
          </a>

          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            <Home size={16} />
            <span>Back to Store</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
