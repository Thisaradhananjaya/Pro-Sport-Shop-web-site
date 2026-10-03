import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'prosport_token';
const USER_KEY  = 'prosport_user';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const decodeJwt = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 > Date.now();
};

const API_BASE = '/api';

/* ─────────────────────────────────────────────
   Provider
───────────────────────────────────────────── */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* Restore session from localStorage on mount */
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser  = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser && isTokenValid(savedToken)) {
      setToken(savedToken);
      try { setUser(JSON.parse(savedUser)); } catch { /* ignore */ }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setAuthLoading(false);
  }, []);

  /* ── Register (customer only) ── */
  const register = async ({ name, email, password }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      _saveSession(data.token, data.user);
    }
    return data;
  };

  /* ── Unified Login (admin + customer) ── */
  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      _saveSession(data.token, data.user);
    }
    return data;
  };

  /* ── Logout ── */
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch { /* ignore network errors */ }
    _clearSession();
  }, []);

  /* ── Internal helpers ── */
  const _saveSession = (newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const _clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  /* ── Computed helpers ── */
  const isAuthenticated = !!user && !!token && isTokenValid(token);
  const isAdmin         = isAuthenticated && user?.role === 'admin';
  const isCustomer      = isAuthenticated && user?.role === 'customer';

  /** Returns headers with Bearer token for API calls */
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  return (
    <AuthContext.Provider value={{
      user,
      token,
      authLoading,
      isAuthenticated,
      isAdmin,
      isCustomer,
      login,
      logout,
      register,
      authHeaders,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
