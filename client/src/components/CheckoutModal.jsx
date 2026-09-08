import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/api';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    cartSubtotal,
    formatPrice,
    clearCart,
    showToast
  } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Colombo',
    paymentMethod: 'CARD',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const shippingFee = cartSubtotal > 50000 ? 0 : 750;
  const totalAmount = cartSubtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.address) {
      showToast('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    const orderPayload = {
      ...formData,
      items: cartItems,
      subtotal: cartSubtotal,
      shipping: shippingFee,
      totalAmount,
    };

    const res = await submitOrder(orderPayload);
    setIsSubmitting(false);

    if (res && res.success) {
      setCompletedOrder(res.data);
      clearCart();
      showToast('🎉 Order placed successfully!');
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} style={{ color: '#FF5500' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
              {completedOrder ? 'Order Confirmed' : 'Secure Checkout'}
            </h3>
          </div>
          <button type="button" className="drawer-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {completedOrder ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <CheckCircle size={56} style={{ color: '#10B981', margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px', color: '#FFFFFF' }}>
                Thank you for your order!
              </h4>
              <p style={{ color: '#94A3B8', fontSize: '13.5px', marginBottom: '20px' }}>
                Order ID: <strong style={{ color: '#FF5500' }}>{completedOrder.orderId || 'ORD-982103'}</strong>
              </p>
              
              <div style={{ background: '#182030', borderRadius: '8px', padding: '16px', textAlign: 'left', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#94A3B8' }}>
                  <span>Recipient:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{completedOrder.customerName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#94A3B8' }}>
                  <span>Delivery Address:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{completedOrder.address}, {completedOrder.city}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800, color: '#FFFFFF', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>Total Paid:</span>
                  <span style={{ color: '#FF5500' }}>{formatPrice(completedOrder.totalAmount || totalAmount)}</span>
                </div>
              </div>

              <button
                type="button"
                className="hero-cta-btn"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleClose}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thisara Dhananjaya"
                  className="form-input"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street Address, Apt / Suite"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City / Region</label>
                <input
                  type="text"
                  placeholder="e.g. Colombo, Kandy, Galle"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              {/* Payment Method Selector */}
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'CARD', label: 'Credit Card', icon: CreditCard },
                    { id: 'COD', label: 'Cash on Del.', icon: Truck },
                    { id: 'KOKO', label: 'Koko (3x)', icon: RefreshCw },
                  ].map((pm) => {
                    const isSelected = formData.paymentMethod === pm.id;
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 6px',
                          borderRadius: '6px',
                          border: isSelected ? '1.5px solid #FF5500' : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: isSelected ? 'rgba(255,85,0,0.12)' : '#182030',
                          color: isSelected ? '#FFFFFF' : '#94A3B8',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        <Icon size={16} style={{ color: isSelected ? '#FF5500' : '#94A3B8' }} />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Breakdown Box */}
              <div style={{ background: '#0A0D14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94A3B8', marginBottom: '6px' }}>
                  <span>Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
                  <span>Island-wide Delivery</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, color: '#FFFFFF', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>Total Amount</span>
                  <span style={{ color: '#FF5500' }}>{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="checkout-btn"
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'PROCESSING ORDER...' : `CONFIRM & PAY (${formatPrice(totalAmount)})`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
