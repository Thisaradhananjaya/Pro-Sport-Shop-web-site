import React, { useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { useAuth } from '../context/AuthContext';
import './admin.css';

/**
 * AdminApp — root of the /admin SPA.
 *
 * Auth is now handled via the shared AuthContext (JWT + localStorage).
 * - If not authenticated at all → show AdminLogin
 * - If authenticated but role !== 'admin' → redirect to /
 * - If authenticated as admin → show AdminDashboard
 */
export function AdminApp() {
  const { user, isAuthenticated, isAdmin, authLoading, login, logout } = useAuth();

  /* If a customer somehow lands on /admin, send them away */
  useEffect(() => {
    if (!authLoading && isAuthenticated && !isAdmin) {
      window.location.href = '/';
    }
  }, [authLoading, isAuthenticated, isAdmin]);

  const handleLoginSuccess = async (email, password) => {
    return login({ email, password });
  };

  const handleLogout = async () => {
    await logout();
    // Stay on /admin — AdminLogin will render
  };

  if (authLoading) {
    return (
      <div className="admin-root" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="admin-spinner" style={{ margin: '0 auto 14px' }} />
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      {isAuthenticated && isAdmin ? (
        <AdminDashboard admin={user} onLogout={handleLogout} />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
