import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AdminApp } from './admin/AdminApp.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './index.css';

// Route /admin paths to the Admin SPA; everything else goes to the main store
const isAdminRoute = window.location.pathname.startsWith('/admin');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminRoute ? (
      <AdminApp />
    ) : (
      <CartProvider>
        <App />
      </CartProvider>
    )}
  </React.StrictMode>,
);
