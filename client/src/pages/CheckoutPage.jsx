import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Lock, CreditCard, ShoppingBag, ArrowLeft, AlertCircle, CheckCircle2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CheckoutPage = () => {
  const { cartItems, cartSubtotal, formatPrice } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamically computed from real cart
  const amount = parseFloat(cartSubtotal.toFixed(2));
  const currency = 'LKR';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayHereSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Generate unique Order ID
      const orderId = `PROSPORT-${Date.now()}`;

      // 2. Build human-readable items string from real cart
      const itemsSummary = cartItems
        .map((item) => `${item.quantity || 1}x ${item.title}`)
        .join(', ');

      // 3. Request hash and payment payload from backend
      const response = await axios.post('/api/payment/initiate', {
        orderId,
        amount: amount,
        currency: currency,
        items: itemsSummary,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: 'Sri Lanka',
        },
      });

      const { paymentData, actionUrl } = response.data;

      if (!paymentData || !actionUrl) {
        throw new Error('Invalid payment initialization response from server.');
      }

      // 4. Create a dynamic hidden HTML form and submit to PayHere Sandbox
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = actionUrl;
      form.style.display = 'none';

      Object.keys(paymentData).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('Checkout error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to connect to PayHere payment gateway. Please try again.'
      );
      setLoading(false);
    }
  };

  // Format amount for the Pay button label (e.g. 53,200.00)
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#f9fafb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Header */}
      <header style={{ borderBottom: '1px solid #1f2937', backgroundColor: '#0b0f19', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="/"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}
            >
              <ArrowLeft size={18} />
              <span>Back to Store</span>
            </a>
            <div style={{ height: '20px', width: '1px', backgroundColor: '#374151' }}></div>
            <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>
              <span style={{ color: '#ffffff' }}>PRO</span>
              <span style={{ color: '#ff6b00' }}>SPORT</span>
              <span style={{ marginLeft: '8px', fontSize: '11px', background: '#ff6b0020', color: '#ff6b00', border: '1px solid #ff6b0040', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Checkout
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '13px', fontWeight: '600' }}>
            <Lock size={15} />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px 0' }}>
            PayHere Sandbox Checkout
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
            Complete your order with secure payment through PayHere Gateway.
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#ef444415', border: '1px solid #ef444450', color: '#fca5a5', padding: '14px 18px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} style={{ color: '#ef4444' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Empty cart warning */}
        {cartItems.length === 0 && (
          <div style={{ backgroundColor: '#f59e0b15', border: '1px solid #f59e0b50', color: '#fcd34d', padding: '20px 24px', borderRadius: '10px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <ShoppingCart size={24} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: '700', margin: '0 0 4px 0', fontSize: '15px' }}>Your cart is empty</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#d1a012' }}>
                Please <a href="/" style={{ color: '#ff6b00', textDecoration: 'underline' }}>add items to your cart</a> before proceeding to checkout.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '32px', alignItems: 'start' }}>
          {/* Left Column: Shipping Form */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #1f2937', paddingBottom: '14px' }}>
              <ShieldCheck size={22} style={{ color: '#ff6b00' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: 0 }}>Customer &amp; Shipping Details</h2>
            </div>

            <form onSubmit={handlePayHereSubmit}>
              {/* 2-Column Name Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '6px', padding: '11px 14px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '6px', padding: '11px 14px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '6px', padding: '11px 14px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0771234567"
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '6px', padding: '11px 14px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              {/* Address */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px' }}>
                  Delivery Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street Address, House No"
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '6px', padding: '11px 14px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              {/* City */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Colombo"
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '6px', padding: '11px 14px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                style={{
                  width: '100%',
                  padding: '15px 24px',
                  backgroundColor: (loading || cartItems.length === 0) ? '#2563eb80' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: (loading || cartItems.length === 0) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                <CreditCard size={20} />
                <span>
                  {loading
                    ? 'Connecting to PayHere...'
                    : cartItems.length === 0
                    ? 'Cart is Empty'
                    : `Pay with PayHere (Rs. ${formattedAmount})`}
                </span>
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px', position: 'sticky', top: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #1f2937', paddingBottom: '12px' }}>
              <ShoppingBag size={20} style={{ color: '#ff6b00' }} />
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                Order Summary
                {cartItems.length > 0 && (
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#9ca3af', fontWeight: '400' }}>
                    ({cartItems.reduce((a, b) => a + (b.quantity || 1), 0)} item{cartItems.reduce((a, b) => a + (b.quantity || 1), 0) !== 1 ? 's' : ''})
                  </span>
                )}
              </h2>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#6b7280' }}>
                <ShoppingCart size={36} style={{ opacity: 0.3, margin: '0 auto 10px' }} />
                <p style={{ fontSize: '13px', margin: 0 }}>No items in cart</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {cartItems.map((item) => {
                  const id = item.id || item._id || item.title;
                  const itemTotal = item.price * (item.quantity || 1);
                  return (
                    <div
                      key={id}
                      style={{ display: 'flex', gap: '14px', backgroundColor: '#030712', border: '1px solid #1f2937', borderRadius: '8px', padding: '14px' }}
                    >
                      {item.image && (
                        <img
                          src={item.image?.startsWith('/') ? `http://localhost:5000${item.image}` : item.image}
                          alt={item.title}
                          style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #374151', flexShrink: 0 }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </h4>
                        {item.category && (
                          <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 6px 0' }}>{item.category}</p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            Qty: {item.quantity || 1} x {formatPrice(item.price)}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#ff6b00' }}>
                            {formatPrice(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid #1f2937', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#9ca3af' }}>
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#9ca3af' }}>
                <span>Delivery (Colombo Metro)</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#9ca3af' }}>
                <span>Gateway Fee (PayHere Sandbox)</span>
                <span>Rs. 0.00</span>
              </div>
            </div>

            {/* Total Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>Total Payable</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#ff6b00' }}>
                Rs. {formattedAmount}
              </span>
            </div>

            {/* Gateway Badge Box */}
            <div style={{ backgroundColor: '#1e293b50', border: '1px solid #334155', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: '600', marginBottom: '4px' }}>
                <CheckCircle2 size={14} />
                <span>PayHere Sandbox Enabled</span>
              </div>
              <div>Merchant ID: <strong>1238481</strong></div>
              <div>Currency: <strong>LKR</strong></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
