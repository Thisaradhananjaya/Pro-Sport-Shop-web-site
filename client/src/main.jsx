import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AdminApp } from './admin/AdminApp.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import './index.css';

const path = window.location.pathname;

/* ─── Simple client-side routing ─────────────────────
   /admin/*   → Admin SPA (own auth flow)
   /login     → Unified Login page
   /register  → Customer Registration page
   *          → Main store
──────────────────────────────────────────────────── */
const renderApp = () => {
  if (path.startsWith('/admin')) {
    // Admin SPA keeps its own localStorage auth for now
    return (
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    );
  }

  if (path === '/login') {
    return (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
  }

  if (path === '/register') {
    return (
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );
  }

  // Main store
  return (
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {renderApp()}
  </React.StrictMode>,
);
