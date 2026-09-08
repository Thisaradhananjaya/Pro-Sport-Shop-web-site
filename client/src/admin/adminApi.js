const API_BASE = '/api';

/** Get stored JWT token */
const getToken = () => localStorage.getItem('prosport_admin_token');

/** Build standard auth headers */
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

/* ---- Auth ---- */

export const adminLogin = async (email, password) => {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

/* ---- Stats ---- */

export const fetchAdminStats = async () => {
  const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
  return res.json();
};

/* ---- Products ---- */

export const adminFetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const adminCreateProduct = async (productData) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(productData),
  });
  return res.json();
};

export const adminUpdateProduct = async (id, productData) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(productData),
  });
  return res.json();
};

export const adminDeleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.json();
};
