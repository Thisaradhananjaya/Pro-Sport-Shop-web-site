import React from 'react';
import { X, User, LogIn, UserPlus, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const AccountModal = () => {
  const { isAccountOpen, setIsAccountOpen, showToast } = useCart();
  const { user, isAuthenticated, isAdmin, isCustomer, logout } = useAuth();

  if (!isAccountOpen) return null;

  const handleLogout = async () => {
    setIsAccountOpen(false);
    await logout();
    showToast('You have been signed out. See you soon!');
    window.location.href = '/';
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAccountOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} style={{ color: '#FF5500' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
              {isAuthenticated ? 'My Account' : 'Sign In / Register'}
            </h3>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsAccountOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isAuthenticated ? (
            /* ── Logged-in view ── */
            <div className="account-modal-user">
              <div className="account-modal-avatar">
                {isAdmin
                  ? <Shield size={28} style={{ color: '#FF5500' }} />
                  : <span>{user.name.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div className="account-modal-info">
                <div className="account-modal-name">{user.name}</div>
                <div className="account-modal-email">{user.email}</div>
                <div className={`account-modal-role ${isAdmin ? 'account-modal-role--admin' : ''}`}>
                  {isAdmin ? '⚙ Administrator' : '👤 Customer'}
                </div>
              </div>

              {isAdmin && (
                <a
                  href="/admin/dashboard"
                  className="account-modal-action-btn account-modal-action-btn--admin"
                  onClick={() => setIsAccountOpen(false)}
                >
                  <Shield size={15} />
                  Go to Dashboard
                </a>
              )}

              <button
                id="account-modal-logout"
                type="button"
                className="account-modal-logout-btn"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* ── Guest view ── */
            <div className="account-modal-guest">
              <p style={{ color: '#94A3B8', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                Sign in to track orders, save your wishlist, and enjoy a faster checkout experience.
              </p>

              <a
                href="/login"
                id="account-modal-login-link"
                className="checkout-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', textDecoration: 'none', marginBottom: '12px' }}
                onClick={() => setIsAccountOpen(false)}
              >
                <LogIn size={16} />
                SIGN IN
              </a>

              <a
                href="/register"
                id="account-modal-register-link"
                className="checkout-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
                  textDecoration: 'none', background: 'transparent',
                  border: '1.5px solid rgba(255,85,0,0.4)', color: '#FF5500'
                }}
                onClick={() => setIsAccountOpen(false)}
              >
                <UserPlus size={16} />
                CREATE ACCOUNT
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
