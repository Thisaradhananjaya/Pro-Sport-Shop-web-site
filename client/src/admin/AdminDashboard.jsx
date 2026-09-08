import React, { useState, useEffect, useCallback } from 'react';
import { AdminProductForm } from './AdminProductForm';
import {
  fetchAdminStats,
  adminFetchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from './adminApi';

/* ---- Icon helpers (inline SVG) ---- */
const Icon = {
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  ),
  Products: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
  ),
  Add: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Edit: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Trash: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
  ),
  Logout: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Alert: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
};

/* ---- Toast ---- */
function AdminToast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!message) return null;
  return (
    <div className={`admin-toast ${type}`}>
      {type === 'success' ? <Icon.Check /> : <Icon.X />}
      {message}
    </div>
  );
}

/* ---- Confirm Dialog ---- */
function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="admin-dialog-backdrop" onClick={onCancel}>
      <div className="admin-dialog" onClick={e => e.stopPropagation()}>
        <div className="admin-dialog-icon"><Icon.Alert /></div>
        <div className="admin-dialog-title">{title}</div>
        <p className="admin-dialog-msg">{message}</p>
        <div className="admin-dialog-actions">
          <button className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="admin-btn admin-btn-danger" onClick={onConfirm} id="admin-confirm-delete-btn">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   DASHBOARD HOME VIEW
   ================================================================ */
function DashboardHome({ stats, products }) {
  const catEntries = stats?.categoryBreakdown ? Object.entries(stats.categoryBreakdown) : [];

  return (
    <div>
      {/* Stat cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card-icon orange">
            <Icon.Products />
          </div>
          <div className="admin-stat-value">{stats?.productCount ?? '—'}</div>
          <div className="admin-stat-label">Total Products</div>
          <div className="admin-stat-card-glow" />
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card-icon green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div className="admin-stat-value">{products.filter(p => p.inStock).length}</div>
          <div className="admin-stat-label">In Stock</div>
          <div className="admin-stat-card-glow" />
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card-icon blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div className="admin-stat-value">{products.filter(p => p.featured).length}</div>
          <div className="admin-stat-label">Featured</div>
          <div className="admin-stat-card-glow" />
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card-icon purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </div>
          <div className="admin-stat-value">{catEntries.length || 6}</div>
          <div className="admin-stat-label">Categories</div>
          <div className="admin-stat-card-glow" />
        </div>
      </div>

      {/* Category breakdown */}
      {catEntries.length > 0 && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
            <div className="admin-section-title" style={{ fontSize: 15 }}>Products by Category</div>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {catEntries.map(([cat, count]) => (
              <div key={cat} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px',
                background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-light)'
              }}>
                <span className="admin-category-badge">{cat}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent products preview */}
      <div className="admin-card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <div className="admin-section-title" style={{ fontSize: 15 }}>Recent Products</div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map(p => {
                const pid = p.id || p._id;
                return (
                  <tr key={pid}>
                    <td>
                      <div className="admin-table-cell-flex">
                        <img src={p.image} alt={p.title} className="admin-product-img" />
                        <div>
                          <div className="admin-product-name">{p.title}</div>
                          <div className="admin-product-brand">{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="admin-category-badge">{p.category}</span></td>
                    <td>
                      <div className="admin-price-primary">Rs. {Number(p.price).toLocaleString()}</div>
                      {p.originalPrice && <div className="admin-price-original">Rs. {Number(p.originalPrice).toLocaleString()}</div>}
                    </td>
                    <td>
                      <span className={`admin-stock-badge ${p.inStock ? 'in-stock' : 'out-stock'}`}>
                        {p.inStock ? '● In Stock' : '● Out of Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   PRODUCTS VIEW
   ================================================================ */
function ProductsView({ products, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');

  const displayed = products.filter(p => {
    const matchCat = catFilter === 'ALL' || p.category.toUpperCase() === catFilter;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      p.title?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div className="admin-section-header">
        <div>
          <div className="admin-section-title">Products</div>
          <div className="admin-section-subtitle">{products.length} total products</div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={onAdd} id="admin-add-product-btn">
          <Icon.Add /> Add New Product
        </button>
      </div>

      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <span className="admin-search-icon"><Icon.Search /></span>
            <input
              className="admin-search-input"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-filter-select"
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {['CRICKET','BADMINTON','FOOTBALL','FITNESS','RUNNING','APPAREL'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {displayed.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📦</div>
            <h4>No products found</h4>
            <p>Try changing the search or filter, or add a new product.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(p => {
                  const pid = p.id || p._id;
                  return (
                    <tr key={pid}>
                      <td>
                        <div className="admin-table-cell-flex">
                          <img src={p.image} alt={p.title} className="admin-product-img" />
                          <div>
                            <div className="admin-product-name" title={p.title}>{p.title}</div>
                            <div className="admin-product-brand">{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="admin-category-badge">{p.category}</span></td>
                      <td>
                        <div className="admin-price-primary">Rs. {Number(p.price).toLocaleString()}</div>
                        {p.originalPrice && <div className="admin-price-original">Rs. {Number(p.originalPrice).toLocaleString()}</div>}
                      </td>
                      <td>
                        <span className={`admin-stock-badge ${p.inStock ? 'in-stock' : 'out-stock'}`}>
                          {p.inStock ? '● In Stock' : '● Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 14 }}>{p.featured ? '⭐ Yes' : '—'}</span>
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          <button
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            onClick={() => onEdit(p)}
                            title="Edit product"
                          >
                            <Icon.Edit /> Edit
                          </button>
                          <button
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => onDelete(p)}
                            title="Delete product"
                          >
                            <Icon.Trash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   MAIN DASHBOARD
   ================================================================ */
export function AdminDashboard({ admin, onLogout }) {
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'products' | 'add' | 'edit'
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await adminFetchProducts();
      if (data.success) setProducts(data.data || []);
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchAdminStats();
      if (data.success) setStats(data.data);
    } catch { /* stats are non-critical */ }
  }, []);

  useEffect(() => {
    loadProducts();
    loadStats();
  }, [loadProducts, loadStats]);

  /* Save product (create or update) */
  const handleSave = async (formData) => {
    setSaving(true);
    try {
      let res;
      if (editTarget) {
        const id = editTarget._id || editTarget.id;
        res = await adminUpdateProduct(id, formData);
      } else {
        res = await adminCreateProduct(formData);
      }

      if (res.success) {
        showToast(editTarget ? 'Product updated successfully!' : 'Product added successfully!');
        await loadProducts();
        await loadStats();
        setView('products');
        setEditTarget(null);
      } else {
        showToast(res.message || 'Operation failed', 'error');
      }
    } catch {
      showToast('Server error. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* Delete product */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id || deleteTarget.id;
    try {
      const res = await adminDeleteProduct(id);
      if (res.success) {
        showToast('Product deleted successfully!');
        await loadProducts();
        await loadStats();
      } else {
        showToast(res.message || 'Delete failed', 'error');
      }
    } catch {
      showToast('Server error. Please try again.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icon.Dashboard },
    { id: 'products', label: 'All Products', icon: Icon.Products },
    { id: 'add', label: 'Add Product', icon: Icon.Add },
  ];

  const topbarInfo = {
    dashboard: { title: 'Dashboard', subtitle: 'Store overview & statistics' },
    products: { title: 'Products', subtitle: 'Manage your product catalog' },
    add: { title: 'Add New Product', subtitle: 'Create a new product listing' },
    edit: { title: 'Edit Product', subtitle: `Editing: ${editTarget?.title || ''}` },
  };

  const adminInitial = admin?.name
    ? admin.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">P</div>
          <div>
            <div className="admin-sidebar-logo-text">PRO<span>SPORT</span></div>
            <div className="admin-sidebar-badge">ADMIN</div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section-label">Navigation</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => {
                setView(item.id);
                if (item.id !== 'edit') setEditTarget(null);
              }}
              id={`admin-nav-${item.id}`}
            >
              <item.icon />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">{adminInitial}</div>
            <div className="admin-sidebar-user-info">
              <div className="admin-sidebar-user-name">{admin?.name || 'Admin'}</div>
              <div className="admin-sidebar-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={onLogout} id="admin-logout-btn">
            <Icon.Logout /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div>
            <div className="admin-topbar-title">{topbarInfo[view]?.title}</div>
            <div className="admin-topbar-subtitle">{topbarInfo[view]?.subtitle}</div>
          </div>
          <div className="admin-topbar-right">
            {view === 'products' && (
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => { setView('add'); setEditTarget(null); }}
              >
                <Icon.Add /> Add Product
              </button>
            )}
          </div>
        </header>

        {/* Content area */}
        <main className="admin-content">
          {loadingProducts && view !== 'add' && view !== 'edit' ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <span>Loading products…</span>
            </div>
          ) : (
            <>
              {view === 'dashboard' && (
                <DashboardHome stats={stats} products={products} />
              )}
              {view === 'products' && (
                <ProductsView
                  products={products}
                  onAdd={() => { setView('add'); setEditTarget(null); }}
                  onEdit={p => { setEditTarget(p); setView('edit'); }}
                  onDelete={p => setDeleteTarget(p)}
                />
              )}
              {(view === 'add' || view === 'edit') && (
                <div>
                  <div className="admin-section-header">
                    <div>
                      <div className="admin-section-title">
                        {view === 'edit' ? 'Edit Product' : 'Add New Product'}
                      </div>
                      <div className="admin-section-subtitle">
                        {view === 'edit' ? `Editing "${editTarget?.title}"` : 'Fill in the product details below'}
                      </div>
                    </div>
                    <button
                      className="admin-btn admin-btn-ghost"
                      onClick={() => { setView('products'); setEditTarget(null); }}
                    >
                      ← Back to Products
                    </button>
                  </div>
                  <AdminProductForm
                    initial={editTarget}
                    onSave={handleSave}
                    onCancel={() => { setView('products'); setEditTarget(null); }}
                    saving={saving}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <AdminToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
