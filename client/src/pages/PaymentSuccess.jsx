import React, { useEffect, useState } from 'react';
import { CheckCircle, Home, ShoppingBag, ArrowRight, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';

/**
 * PaymentSuccess
 * Rendered after PayHere redirects back on a successful payment.
 * Reads the pending order from localStorage, POSTs it to /api/orders to
 * persist it in MongoDB (which feeds the "Top Selling Products" aggregation),
 * then clears the cart and the pending-order snapshot.
 */
export const PaymentSuccess = () => {
  const { clearCart } = useCart();
  const [orderSaved, setOrderSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Read PayHere return query params
  const queryParams = new URLSearchParams(window.location.search);
  const orderId    = queryParams.get('order_id')   || `PROSPORT-${Date.now().toString().slice(-6)}`;
  const amountPaid = queryParams.get('amount')      || null;
  const currency   = queryParams.get('currency')    || 'LKR';

  useEffect(() => {
    const saveOrderAndClearCart = async () => {
      try {
        // 1. Read the order snapshot that CheckoutPage stored before PayHere redirect
        const raw = localStorage.getItem('prosport_pending_order');

        if (raw) {
          const pendingOrder = JSON.parse(raw);

          // 2. POST to /api/orders to persist in MongoDB
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingOrder),
          });

          const data = await res.json();

          if (data.success) {
            setOrderSaved(true);
          } else {
            setSaveError(data.message || 'Order could not be saved.');
          }
        } else {
          // No pending order snapshot (e.g. user refreshed the success page manually)
          setOrderSaved(true);
        }
      } catch (err) {
        console.error('Failed to save order:', err);
        setSaveError('Network error while saving order.');
      } finally {
        // 3. Always clear cart + pending snapshot, even on error
        localStorage.removeItem('prosport_pending_order');
        clearCart();
        localStorage.removeItem('prosport_cart');
      }
    };

    saveOrderAndClearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030712',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '16px',
        padding: '48px 32px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}>

        {/* Large Green Checkmark */}
        <div style={{
          width: '88px', height: '88px',
          backgroundColor: '#10b98115',
          border: '2px solid #10b981',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <CheckCircle size={52} style={{ color: '#10b981' }} />
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: '2.5rem', fontWeight: '900', color: '#10b981',
          margin: '0 0 12px 0', letterSpacing: '-0.5px', lineHeight: 1.1,
        }}>
          Payment Successful!
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '16px', color: '#9ca3af', margin: '0 0 16px 0' }}>
          Your order has been placed successfully. A confirmation will be sent to your email.
        </p>

        {/* Order-save status indicator */}
        <div style={{ marginBottom: '24px', minHeight: '24px' }}>
          {!orderSaved && !saveError && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9ca3af' }}>
              <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Saving your order…
            </span>
          )}
          {orderSaved && (
            <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
              ✓ Order saved successfully
            </span>
          )}
          {saveError && (
            <span style={{ fontSize: '13px', color: '#f59e0b' }}>
              ⚠ {saveError}
            </span>
          )}
        </div>

        {/* Order Details Card */}
        <div style={{
          backgroundColor: '#030712',
          border: '1px solid #1f2937',
          borderRadius: '10px',
          padding: '18px 20px',
          textAlign: 'left',
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#9ca3af' }}>
            <span>Order Reference:</span>
            <span style={{ color: '#ff6b00', fontWeight: '700', fontFamily: 'monospace' }}>{orderId}</span>
          </div>
          {amountPaid && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#9ca3af' }}>
              <span>Total Paid:</span>
              <span style={{ color: '#10b981', fontWeight: '700' }}>
                {currency} {parseFloat(amountPaid).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
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
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '14px 24px', backgroundColor: '#ff6b00',
              color: '#ffffff', borderRadius: '8px', textDecoration: 'none',
              fontWeight: '700', fontSize: '15px',
              boxShadow: '0 4px 14px rgba(255, 107, 0, 0.35)',
            }}
          >
            <Home size={18} />
            <span>Back to Home</span>
          </a>

          <a
            href="/products"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '6px', padding: '12px 20px', backgroundColor: 'transparent',
              color: '#9ca3af', borderRadius: '8px', textDecoration: 'none',
              fontWeight: '600', fontSize: '14px',
            }}
          >
            <ShoppingBag size={16} />
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </a>
        </div>

      </div>

      {/* Spinner keyframe — inline so no extra CSS file needed */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PaymentSuccess;
