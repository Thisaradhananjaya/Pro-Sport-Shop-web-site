import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    formatPrice,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={20} style={{ color: '#FF5500' }} />
            <span>Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-view">
              <ShoppingBag size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
              <h4 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '13px', marginBottom: '20px' }}>
                Explore our catalog of professional sports gear and equipment.
              </p>
              <button
                type="button"
                className="hero-cta-btn"
                style={{ padding: '10px 20px', fontSize: '12px' }}
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const id = item.id || item._id;
              return (
                <div key={id} className="cart-item-card">
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h5 className="cart-item-title">{item.title}</h5>
                    <div className="cart-item-price">{formatPrice(item.price)}</div>
                    <div className="cart-qty-controls">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(id, -1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(id, 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => removeFromCart(id)}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-subtotal-row">
              <span style={{ color: '#94A3B8' }}>Subtotal:</span>
              <span className="cart-subtotal-val">{formatPrice(cartSubtotal)}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '14px' }}>
              * Island-wide delivery calculated during checkout.
            </p>
            <button
              type="button"
              className="checkout-btn"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              <span>PROCEED TO CHECKOUT</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
