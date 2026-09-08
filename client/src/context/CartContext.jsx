import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('prosport_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('prosport_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const getItemId = (item) => {
    if (!item) return '';
    return item.id || item._id || item.title;
  };

  const addToCart = (product, quantity = 1) => {
    const targetId = getItemId(product);
    setCartItems(prevItems => {
      const existing = prevItems.find(item => getItemId(item) === targetId);
      if (existing) {
        return prevItems.map(item =>
          getItemId(item) === targetId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, id: targetId, quantity }];
    });
    showToast(`Added "${product.title}" to your cart!`);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => getItemId(item) !== id));
    showToast('Item removed from cart');
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (getItemId(item) === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  /** Returns true when the product (by id/_id/title) is already in the cart */
  const isInCart = (id) => cartItems.some(item => getItemId(item) === id);

  /** Returns the current cart quantity for a product, or 0 if not in cart */
  const getCartQuantity = (id) => {
    const found = cartItems.find(item => getItemId(item) === id);
    return found ? (found.quantity || 1) : 0;
  };

  const formatPrice = (amount) => {
    return `Rs. ${Number(amount).toLocaleString('en-US')}`;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        formatPrice,
        isInCart,
        getCartQuantity,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
