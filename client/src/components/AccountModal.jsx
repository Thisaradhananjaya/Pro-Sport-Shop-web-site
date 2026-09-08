import React, { useState } from 'react';
import { X, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const AccountModal = () => {
  const { isAccountOpen, setIsAccountOpen, showToast } = useCart();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAccountOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast(isRegister ? `Account registered for ${email}!` : `Welcome back! Signed in as ${email}`);
    setIsAccountOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAccountOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} style={{ color: '#FF5500' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
              {isRegister ? 'Create Pro Sport Account' : 'Sign In to Account'}
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
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Thisara Dhananjaya"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="athlete@prosport.lk"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="checkout-btn"
              style={{ marginTop: '12px' }}
            >
              <span>{isRegister ? 'REGISTER ACCOUNT' : 'SIGN IN'}</span>
            </button>
          </form>

          <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '13px', color: '#94A3B8' }}>
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  style={{ color: '#FF5500', fontWeight: 700, textDecoration: 'underline' }}
                  onClick={() => setIsRegister(false)}
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  style={{ color: '#FF5500', fontWeight: 700, textDecoration: 'underline' }}
                  onClick={() => setIsRegister(true)}
                >
                  Create One
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
