import React, { useState, useEffect } from 'react';

const CATEGORIES = ['CRICKET', 'BADMINTON', 'FOOTBALL', 'FITNESS', 'RUNNING', 'APPAREL'];

const EMPTY_FORM = {
  title: '',
  category: 'CRICKET',
  price: '',
  originalPrice: '',
  image: '',
  brand: '',
  description: '',
  rating: '4.8',
  reviewsCount: '24',
  inStock: true,
  featured: true,
  specs: [{ label: '', value: '' }],
};

export function AdminProductForm({ initial = null, onSave, onCancel, saving = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imgError, setImgError] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (initial) {
      setForm({
        ...EMPTY_FORM,
        ...initial,
        price: String(initial.price ?? ''),
        originalPrice: String(initial.originalPrice ?? ''),
        rating: String(initial.rating ?? '4.8'),
        reviewsCount: String(initial.reviewsCount ?? '24'),
        specs: Array.isArray(initial.specs) && initial.specs.length > 0
          ? initial.specs.map(s => ({ label: s.label || '', value: s.value || '' }))
          : [{ label: '', value: '' }],
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const setSpec = (index, field, value) => {
    setForm(prev => {
      const specs = [...prev.specs];
      specs[index] = { ...specs[index], [field]: value };
      return { ...prev, specs };
    });
  };

  const addSpec = () => setForm(prev => ({ ...prev, specs: [...prev.specs, { label: '', value: '' }] }));

  const removeSpec = (index) =>
    setForm(prev => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      rating: Number(form.rating),
      reviewsCount: Number(form.reviewsCount),
      category: form.category.toUpperCase(),
      specs: form.specs.filter(s => s.label.trim() || s.value.trim()),
    };
    onSave(payload);
  };

  const isEditing = !!initial;

  return (
    <form onSubmit={handleSubmit} id="admin-product-form">
      <div className="admin-form-card">
        <div className="admin-form-grid">

          {/* Title */}
          <div className="admin-form-group-admin full-width">
            <label className="admin-label">Product Title *</label>
            <input
              className="admin-input"
              required
              placeholder="e.g. Yonex Astrox 99 Pro"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          {/* Brand */}
          <div className="admin-form-group-admin">
            <label className="admin-label">Brand *</label>
            <input
              className="admin-input"
              required
              placeholder="e.g. Yonex"
              value={form.brand}
              onChange={e => set('brand', e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="admin-form-group-admin">
            <label className="admin-label">Category *</label>
            <select
              className="admin-select"
              required
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="admin-form-group-admin">
            <label className="admin-label">Price (Rs.) *</label>
            <input
              className="admin-input"
              type="number"
              required
              min="0"
              placeholder="e.g. 32800"
              value={form.price}
              onChange={e => set('price', e.target.value)}
            />
          </div>

          {/* Original Price */}
          <div className="admin-form-group-admin">
            <label className="admin-label">Original Price (Rs.)</label>
            <input
              className="admin-input"
              type="number"
              min="0"
              placeholder="e.g. 36500 (leave blank if no discount)"
              value={form.originalPrice}
              onChange={e => set('originalPrice', e.target.value)}
            />
          </div>

          {/* Rating */}
          <div className="admin-form-group-admin">
            <label className="admin-label">Rating (0–5)</label>
            <input
              className="admin-input"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={e => set('rating', e.target.value)}
            />
          </div>

          {/* Reviews Count */}
          <div className="admin-form-group-admin">
            <label className="admin-label">Reviews Count</label>
            <input
              className="admin-input"
              type="number"
              min="0"
              value={form.reviewsCount}
              onChange={e => set('reviewsCount', e.target.value)}
            />
          </div>

          {/* Image */}
          <div className="admin-form-group-admin full-width">
            <label className="admin-label">Product Image *</label>
            <input
              className="admin-input"
              type="file"
              accept="image/*"
              required={!form.image}
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => {
                    set('image', ev.target.result);
                    setImgError(false);
                  };
                  reader.onerror = () => setImgError(true);
                  reader.readAsDataURL(file);
                }
              }}
            />
            {form.image && !imgError && (
              <div className="admin-img-preview">
                <img src={form.image} alt="Preview" onError={() => setImgError(true)} />
              </div>
            )}
            {imgError && (
              <p style={{ color: '#FCA5A5', fontSize: 12, marginTop: 5 }}>
                ⚠ Could not load image. Please select a valid image file.
              </p>
            )}
          </div>

          {/* Description */}
          <div className="admin-form-group-admin full-width">
            <label className="admin-label">Description</label>
            <textarea
              className="admin-textarea"
              placeholder="Describe the product features, materials, and benefits..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* In Stock toggle */}
          <div className="admin-form-group-admin">
            <label className="admin-label">Availability</label>
            <div className="admin-toggle-group">
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={e => set('inStock', e.target.checked)}
                />
                <span className="admin-toggle-slider" />
              </label>
              <span className="admin-toggle-label">
                {form.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>
          </div>

          {/* Featured toggle */}
          <div className="admin-form-group-admin">
            <label className="admin-label">Featured Product</label>
            <div className="admin-toggle-group">
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => set('featured', e.target.checked)}
                />
                <span className="admin-toggle-slider" />
              </label>
              <span className="admin-toggle-label">
                {form.featured ? '⭐ Featured' : 'Not Featured'}
              </span>
            </div>
          </div>

          {/* Specs */}
          <div className="admin-form-group-admin full-width">
            <label className="admin-label">Product Specifications</label>
            <div className="admin-specs-list">
              {form.specs.map((spec, i) => (
                <div key={i} className="admin-spec-row">
                  <input
                    className="admin-input"
                    placeholder="Label (e.g. Weight)"
                    value={spec.label}
                    onChange={e => setSpec(i, 'label', e.target.value)}
                  />
                  <input
                    className="admin-input"
                    placeholder="Value (e.g. 500g)"
                    value={spec.value}
                    onChange={e => setSpec(i, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-spec-remove-btn"
                    onClick={() => removeSpec(i)}
                    title="Remove spec"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
              <button type="button" className="admin-add-spec-btn" onClick={addSpec}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Specification
              </button>
            </div>
          </div>

        </div>{/* /form-grid */}

        {/* Action buttons */}
        <div className="admin-form-actions">
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={saving}
            id="admin-product-save-btn"
          >
            {saving ? (
              <>
                <span className="admin-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                Saving…
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {isEditing ? 'Save Changes' : 'Add Product'}
              </>
            )}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
