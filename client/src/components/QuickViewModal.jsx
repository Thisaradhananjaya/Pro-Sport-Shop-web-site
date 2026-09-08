import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Check, Shield, Truck, RotateCcw, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, formatPrice, isInCart, getCartQuantity } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const productId = quickViewProduct ? (quickViewProduct.id || quickViewProduct._id || quickViewProduct.title) : null;
  const inCart = productId ? isInCart(productId) : false;
  const cartQty = productId ? getCartQuantity(productId) : 0;

  // Seed quantity to the current cart quantity (or 1 for new items)
  const [quantity, setQuantity] = useState(inCart ? cartQty : 1);

  // Re-seed quantity whenever the viewed product changes
  useEffect(() => {
    if (quickViewProduct) {
      const id = quickViewProduct.id || quickViewProduct._id || quickViewProduct.title;
      const qty = getCartQuantity(id);
      setQuantity(qty > 0 ? qty : 1);
    }
    setIsAdded(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleAdd = () => {
    addToCart(quickViewProduct, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1600);
  };

  return (
    <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="product-category-tag" style={{ margin: 0 }}>
            {quickViewProduct.category}
          </span>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setQuickViewProduct(null)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Product Image */}
            <div
              style={{
                backgroundColor: '#0A0D14',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '260px'
              }}
            >
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.title}
                style={{ maxHeight: '220px', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Product Info */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginBottom: '4px' }}>
                Brand: {quickViewProduct.brand || 'ProSport Pro Edition'}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                {quickViewProduct.title}
              </h3>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', color: '#F59E0B' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" />
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                  {quickViewProduct.rating || '4.9'} ({quickViewProduct.reviewsCount || 34} verified reviews)
                </span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#FF5500' }}>
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice && (
                  <span style={{ fontSize: '14px', color: '#64748B', textDecoration: 'line-through' }}>
                    {formatPrice(quickViewProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5', marginBottom: '16px' }}>
                {quickViewProduct.description || 'Engineered with elite high-performance specifications tailored for professional athletic competition and durability.'}
              </p>

              {/* Specifications pills */}
              {quickViewProduct.specs && quickViewProduct.specs.length > 0 && (
                <div style={{ marginBottom: '18px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {quickViewProduct.specs.map((spec, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        background: '#182030',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        color: '#94A3B8',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <strong style={{ color: '#FFFFFF' }}>{spec.label}:</strong> {spec.value}
                    </span>
                  ))}
                </div>
              )}

              {/* "Already in cart" info chip */}
              {inCart && !isAdded && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#10B981',
                  background: 'rgba(16,185,129,0.10)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  marginBottom: '8px',
                  width: 'fit-content',
                }}>
                  <Check size={13} />
                  <span>Already in cart &mdash; qty {cartQty}</span>
                </div>
              )}

              {/* Action Controls */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <div className="cart-qty-controls" style={{ background: '#182030', padding: '4px 8px', borderRadius: '6px' }}>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className={`add-to-cart-btn ${isAdded ? 'added' : inCart ? 'in-cart' : ''}`}
                  style={{ flex: 1, padding: '10px' }}
                  onClick={handleAdd}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      <span>Added to Cart!</span>
                    </>
                  ) : inCart ? (
                    <>
                      <ShoppingCart size={16} />
                      <span>Update Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
