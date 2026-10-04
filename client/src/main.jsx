import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AdminApp } from './admin/AdminApp.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import './index.css';

const path = window.location.pathname;

/* ─── Simple client-side routing ─────────────────────
   /admin/*   → Admin SPA — protected, admin-only
   /login     → Unified Login page
   /register  → Customer Registration page
   *          → Main store
──────────────────────────────────────────────────── */
const renderApp = () => {
  if (path.startsWith('/admin')) {
    return (
      <AuthProvider>
        {/*
          AdminApp handles its own RBAC:
          • Not logged in         → shows AdminLogin form
          • Customer logged in    → redirects to /
          • Admin logged in       → shows AdminDashboard
          ProtectedRoute is available for protecting individual
          pages — import it from components/ProtectedRoute.jsx
        */}
        <AdminApp />
      </AuthProvider>
    );
  }

  if (path === '/login') {
    return (
      <AuthProvider>
        {/* LoginPage handles its own redirect-if-already-authenticated */}
        <LoginPage />
      </AuthProvider>
    );
  }

  if (path === '/register') {
    return (
      <AuthProvider>
        {/* RegisterPage handles its own redirect-if-already-authenticated */}
        <RegisterPage />
      </AuthProvider>
    );
  }

  // Main store — public, no auth required (auth state is available via context)
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
