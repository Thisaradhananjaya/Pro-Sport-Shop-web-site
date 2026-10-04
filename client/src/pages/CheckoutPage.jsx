import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Lock, CreditCard, ShoppingBag, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    firstName: 'Thisara',
    lastName: 'Dhananjaya',
    email: 'thisara@example.com',
    phone: '0771234567',
    address: 'No 45, Temple Road',
    city: 'Colombo',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const orderItem = {
    name: 'Nike Pegasus 40 Running Shoes',
    tag: 'Men’s Road Running • Size UK 9',
    qty: 1,
    unitPrice: 29500.0,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  };

  const amount = 29500.0;
  const currency = 'LKR';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayHereSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Generate unique Order ID
      const orderId = `PROSPORT-${Date.now()}`;

      // 2. Request hash and payment payload from backend
      const response = await axios.post('/api/payment/initiate', {
        orderId,
        amount: amount,
        currency: currency,
        items: '1x Nike Pegasus 40',
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

      // 3. Create a dynamic hidden HTML form and submit to PayHere Sandbox
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '32px', alignItems: 'start' }}>
          {/* Left Column: Shipping Form */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #1f2937', paddingBottom: '14px' }}>
              <ShieldCheck size={22} style={{ color: '#ff6b00' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: 0 }}>Customer & Shipping Details</h2>
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
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px 24px',
                  backgroundColor: loading ? '#2563eb80' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                <CreditCard size={20} />
                <span>{loading ? 'Connecting to PayHere...' : 'Pay with PayHere (Rs. 29,500.00)'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px', position: 'sticky', top: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #1f2937', paddingBottom: '12px' }}>
              <ShoppingBag size={20} style={{ color: '#ff6b00' }} />
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff', margin: 0 }}>Order Summary</h2>
            </div>

            {/* Product Card */}
            <div style={{ display: 'flex', gap: '14px', backgroundColor: '#030712', border: '1px solid #1f2937', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
              <img
                src={orderItem.image}
                alt={orderItem.name}
                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #374151' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px 0' }}>{orderItem.name}</h4>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px 0' }}>{orderItem.tag}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Qty: {orderItem.qty}</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#ff6b00' }}>Rs. 29,500.00</span>
                </div>
              </div>
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid #1f2937', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#9ca3af' }}>
                <span>Subtotal</span>
                <span>Rs. 29,500.00</span>
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
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#ff6b00' }}>Rs. 29,500.00</span>
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
