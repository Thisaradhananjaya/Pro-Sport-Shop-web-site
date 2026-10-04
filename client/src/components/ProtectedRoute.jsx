import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * ─────────────────────────────────────────────────────────────────
 * Wraps any page/component to enforce authentication and optional
 * role-based access control.
 *
 * Props:
 *   children        – The component to render when access is granted.
 *   requireAuth     – (default true) Redirects to /login if not logged in.
 *   requireAdmin    – (default false) Redirects to / if user is not admin.
 *   requireCustomer – (default false) Redirects to /admin/dashboard if admin
 *                     tries to access a customer-only page.
 *   redirectTo      – Custom redirect path (overrides the defaults above).
 *
 * Usage examples:
 *   <ProtectedRoute>                       → any logged-in user
 *   <ProtectedRoute requireAdmin>          → admins only
 *   <ProtectedRoute requireCustomer>       → customers only
 *   <ProtectedRoute requireAuth={false}>   → public (but auth-aware)
 * ─────────────────────────────────────────────────────────────────
 */
export function ProtectedRoute({
  children,
  requireAuth     = true,
  requireAdmin    = false,
  requireCustomer = false,
  redirectTo      = null,
}) {
  const { isAuthenticated, isAdmin, isCustomer, authLoading } = useAuth();

  /* ── 1. Show a spinner while auth state is being resolved from localStorage ── */
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36,
            height: 36,
            border: '3px solid rgba(255,85,0,0.2)',
            borderTopColor: '#FF5500',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
            margin: '0 auto 12px',
          }} />
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Verifying session…
          </div>
        </div>
      </div>
    );
  }

  /* ── 2. Not logged in but route requires authentication ── */
  if (requireAuth && !isAuthenticated) {
    window.location.replace(redirectTo || '/login');
    return null;
  }

  /* ── 3. Logged in but as a customer and route is admin-only ── */
  if (requireAdmin && !isAdmin) {
    window.location.replace(redirectTo || '/');
    return null;
  }

  /* ── 4. Logged in as admin but route is customer-only ── */
  if (requireCustomer && !isCustomer) {
    window.location.replace(redirectTo || '/admin/dashboard');
    return null;
  }

  /* ── 5. All checks passed — render children ── */
  return <>{children}</>;
}

export default ProtectedRoute;
