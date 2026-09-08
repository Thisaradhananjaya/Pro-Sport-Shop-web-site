import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <Sparkles size={16} style={{ color: '#FF5500', flexShrink: 0 }} />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
