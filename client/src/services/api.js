import { initialProducts, initialCategories } from '../data/mockData';

const API_BASE = '/api';

export const fetchProducts = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Using client mock data for products fallback:', err.message);
    let filtered = [...initialProducts];
    if (params.category && params.category !== 'ALL' && params.category !== 'HOME') {
      filtered = filtered.filter(p => p.category.toUpperCase() === params.category.toUpperCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return filtered;
  }
};

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE}/products/categories`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Using client mock data for categories fallback:', err.message);
    return initialCategories;
  }
};

export const submitOrder = async (orderPayload) => {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Simulating order creation locally:', err.message);
    return {
      success: true,
      message: 'Order created successfully! (Demo Mode)',
      data: {
        orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        ...orderPayload,
        status: 'Processing',
      },
    };
  }
};
