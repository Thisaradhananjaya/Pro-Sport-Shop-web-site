import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import './admin.css';

export function AdminApp() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  // Check for an existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('prosport_admin_token');
    const info = localStorage.getItem('prosport_admin_info');
    if (token && info) {
      try {
        // Decode JWT to check expiry without a library
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          setAdmin(JSON.parse(info));
        } else {
          // Token expired — clear storage
          localStorage.removeItem('prosport_admin_token');
          localStorage.removeItem('prosport_admin_info');
        }
      } catch {
        localStorage.removeItem('prosport_admin_token');
        localStorage.removeItem('prosport_admin_info');
      }
    }
    setChecking(false);
  }, []);

  const handleLoginSuccess = (adminInfo) => {
    setAdmin(adminInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('prosport_admin_token');
    localStorage.removeItem('prosport_admin_info');
    setAdmin(null);
  };

  if (checking) {
    // Brief splash while checking session
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
      {admin ? (
        <AdminDashboard admin={admin} onLogout={handleLogout} />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
