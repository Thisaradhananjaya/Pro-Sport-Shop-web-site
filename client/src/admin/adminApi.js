const API_BASE = '/api';

/** Get stored JWT token (shared key with AuthContext) */
const getToken = () => localStorage.getItem('prosport_token');

/** Build standard auth headers (JSON) */
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

/** Auth headers without Content-Type — used for multipart/form-data so the
 *  browser sets the correct boundary automatically. */
const authHeadersMultipart = () => ({
  Authorization: `Bearer ${getToken()}`,
});

/* ---- Auth ---- */

export const adminLogin = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
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

/**
 * adminCreateProduct
 * Accepts a plain object that may contain a `imageFile` (File object).
 * If imageFile is provided, sends multipart/form-data so Multer can save it.
 * Otherwise falls back to JSON (image URL string in the object).
 */
export const adminCreateProduct = async (productData) => {
  const { imageFile, ...rest } = productData;

  if (imageFile instanceof File) {
    // Build FormData for multipart upload
    const fd = new FormData();
    fd.append('image', imageFile);

    // Append all other scalar fields
    Object.entries(rest).forEach(([key, value]) => {
      if (key === 'specs') {
        fd.append('specs', JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        fd.append(key, String(value));
      }
    });

    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: authHeadersMultipart(),
      body: fd,
    });
    return res.json();
  }

  // No file — send JSON (imageFile is undefined, image should be a URL string)
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(rest),
  });
  return res.json();
};

/**
 * adminUpdateProduct
 * Same file-vs-JSON logic as adminCreateProduct.
 */
export const adminUpdateProduct = async (id, productData) => {
  const { imageFile, ...rest } = productData;

  if (imageFile instanceof File) {
    const fd = new FormData();
    fd.append('image', imageFile);

    Object.entries(rest).forEach(([key, value]) => {
      if (key === 'specs') {
        fd.append('specs', JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        fd.append(key, String(value));
      }
    });

    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: authHeadersMultipart(),
      body: fd,
    });
    return res.json();
  }

  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(rest),
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
