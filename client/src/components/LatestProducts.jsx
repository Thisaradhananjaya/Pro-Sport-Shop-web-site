import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const LatestProducts = ({ products = [], onSelectCategory, activeCategory }) => {
  const { addToCart, setQuickViewProduct, formatPrice, isInCart, getCartQuantity } = useCart();
  // flashIds stores { id: 'added' | 'updated' } for the brief post-click flash
  const [flashIds, setFlashIds] = useState({});

  const handleAdd = (product, e) => {
    e.stopPropagation();
    const key = product.id || product._id;
    const alreadyInCart = isInCart(key);

    addToCart(product, 1);

    // Show "Added!" on first add, "Updated!" on subsequent adds
    const flashLabel = alreadyInCart ? 'updated' : 'added';
    setFlashIds(prev => ({ ...prev, [key]: flashLabel }));
    setTimeout(() => {
      setFlashIds(prev => ({ ...prev, [key]: null }));
    }, 1500);
  };

  return (
    <section className="products-section" id="products-section">
      <div className="container">
        {/* Header Row */}
        <div className="products-header-row">
          <div>
            <h2 className="section-title">
              {activeCategory && activeCategory !== 'home'
                ? `${activeCategory.toUpperCase()} PRODUCTS`
                : 'Latest Products'}
            </h2>
            <p className="section-desc">
              Fresh drops and newly restocked premium equipment
            </p>
          </div>

          <button
            type="button"
            className="view-all-link"
            onClick={() => onSelectCategory('home')}
          >
            <span>View All Products</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* 5-Column Products Grid */}
        <div className="products-grid">
          {products.map((product) => {
            const key = product.id || product._id;
            const inCart = isInCart(key);
            const cartQty = getCartQuantity(key);
            const flash = flashIds[key]; // 'added' | 'updated' | null

            // Determine button visual state
            // Priority: flash > persistent in-cart
            const btnClass = flash === 'added'
              ? 'add-to-cart-btn added'
              : flash === 'updated'
              ? 'add-to-cart-btn updated'
              : inCart
              ? 'add-to-cart-btn in-cart'
              : 'add-to-cart-btn';

            return (
              <div
                key={key}
                className="product-card"
                onClick={() => setQuickViewProduct(product)}
              >
                {/* Product Image Box */}
                <div className="product-img-box">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-img"
                    loading="lazy"
                  />
                  {/* Cart quantity badge — only shown when item is in cart */}
                  {inCart && cartQty > 0 && (
                    <span className="cart-qty-badge" title={`${cartQty} in cart`}>
                      {cartQty}
                    </span>
                  )}
                  <button
                    type="button"
                    className="product-badge-quick"
                    title="Quick Preview"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                  >
                    <Eye size={15} />
                  </button>
                </div>

                {/* Product Details */}
                <div className="product-details">
                  <div className="product-category-tag">{product.category}</div>
                  <h4 className="product-title" title={product.title}>
                    {product.title}
                  </h4>
                  <div className="product-price">
                    {formatPrice(product.price)}
                  </div>

                  {/* Add To Cart CTA */}
                  <button
                    type="button"
                    className={btnClass}
                    onClick={(e) => handleAdd(product, e)}
                  >
                    {flash === 'added' ? (
                      <>
                        <Check size={15} />
                        <span>Added!</span>
                      </>
                    ) : flash === 'updated' ? (
                      <>
                        <Check size={15} />
                        <span>Updated!</span>
                      </>
                    ) : inCart ? (
                      <>
                        <Check size={15} />
                        <span>In Cart ({cartQty})</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
