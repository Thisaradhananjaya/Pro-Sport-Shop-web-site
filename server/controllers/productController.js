const path    = require('path');
const multer  = require('multer');
const Product  = require('../models/Product');
const Category = require('../models/Category');
const { productsData, categoriesData } = require('../data/seedData');

/* ──────────────────────────────────────────────────────────
   MULTER SETUP
   Saves uploaded images to server/uploads/ with a unique
   filename:  <fieldname>-<timestamp>-<random>.<ext>
   ────────────────────────────────────────────────────────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase();
    const safeName = path.basename(file.originalname, ext)
                         .replace(/[^a-z0-9_-]/gi, '-')
                         .toLowerCase();
    const unique   = `${safeName}-${Date.now()}-${Math.round(Math.random() * 1e5)}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i;
  if (allowed.test(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp, avif, svg)'));
  }
};

/** Multer instance — exported so productRoutes.js can use it as middleware */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per image
});

exports.upload = upload;

/* ──────────────────────────────────────────────────────────
   HELPER — resolve the image URL for a request
   Priority:
     1. A freshly uploaded file  → /uploads/<filename>
     2. An image URL in the body (editing without re-upload)
   ────────────────────────────────────────────────────────── */
const resolveImageUrl = (req) => {
  if (req.file) {
    // A new file was uploaded via Multer — always use it
    return `/uploads/${req.file.filename}`;
  }
  // Editing without a new upload — keep existing URL if it's a real string
  const existing = req.body.image;
  return (typeof existing === 'string' && existing.trim() !== '') ? existing.trim() : '';
};

// GET all products with filtering & search
exports.getProducts = async (req, res) => {
  try {
    const { category, search, featured, limit } = req.query;

    // Check if Mongo is connected
    const isMongoConnected = Product.db && Product.db.readyState === 1;

    if (isMongoConnected) {
      let query = {};
      if (category && category.toUpperCase() !== 'ALL' && category.toUpperCase() !== 'HOME') {
        query.category = category.toUpperCase();
      }
      if (featured === 'true') {
        query.featured = true;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      let productsQuery = Product.find(query).sort({ createdAt: -1 });
      if (limit) {
        productsQuery = productsQuery.limit(Number(limit));
      }
      const products = await productsQuery.exec();
      return res.json({ success: true, count: products.length, data: products });
    }

    // Fallback in-memory dataset
    let filtered = [...productsData];
    if (category && category.toUpperCase() !== 'ALL' && category.toUpperCase() !== 'HOME') {
      filtered = filtered.filter(p => p.category.toUpperCase() === category.toUpperCase());
    }
    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (limit) {
      filtered = filtered.slice(0, Number(limit));
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving products' });
  }
};

// GET single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoConnected = Product.db && Product.db.readyState === 1;

    if (isMongoConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
      const product = await Product.findById(id);
      if (product) {
        return res.json({ success: true, data: product });
      }
    }

    // Fallback check
    const item = productsData.find(p => p.id === id || p._id === id);
    if (item) {
      return res.json({ success: true, data: item });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving product' });
  }
};

// POST create new product (admin protected)
// Accepts multipart/form-data — image is handled by Multer middleware
exports.createProduct = async (req, res) => {
  try {
    const isMongoConnected = Product.db && Product.db.readyState === 1;

    // Build the image URL (uploaded file takes priority over body field)
    const imageUrl = resolveImageUrl(req);
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Product image is required.' });
    }

    // Destructure `image` out so the empty FormData string never leaks into the payload
    const { image: _bodyImage, specs: rawSpecs, ...otherFields } = req.body;

    // Parse specs if sent as a JSON string (FormData serialises arrays as strings)
    let specs = rawSpecs;
    if (typeof specs === 'string') {
      try { specs = JSON.parse(specs); } catch { specs = []; }
    }

    const productPayload = {
      ...otherFields,
      image: imageUrl,                                                        // always the Multer path
      price: Number(otherFields.price),
      originalPrice: otherFields.originalPrice ? Number(otherFields.originalPrice) : undefined,
      rating: otherFields.rating ? Number(otherFields.rating) : 4.8,
      reviewsCount: otherFields.reviewsCount ? Number(otherFields.reviewsCount) : 24,
      inStock: otherFields.inStock === 'false' ? false : Boolean(otherFields.inStock ?? true),
      featured: otherFields.featured === 'false' ? false : Boolean(otherFields.featured ?? true),
      category: (otherFields.category || '').toUpperCase(),
      specs: Array.isArray(specs) ? specs : [],
    };

    if (isMongoConnected) {
      const product = await Product.create(productPayload);
      return res.status(201).json({ success: true, data: product });
    }

    // Fallback: add to in-memory array
    const { productsData: pData } = require('../data/seedData');
    const newProduct = {
      id: 'prod-' + Date.now(),
      ...productPayload,
      createdAt: new Date().toISOString(),
    };
    pData.push(newProduct);
    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating product' });
  }
};

// PUT update product by ID (admin protected)
// Accepts multipart/form-data — image replacement is optional
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoConnected = Product.db && Product.db.readyState === 1;

    // Destructure `image` out — prevents the empty FormData string from wiping the DB image
    const { image: _bodyImage, specs: rawSpecs, ...otherFields } = req.body;

    // Parse specs if sent as a JSON string
    let specs = rawSpecs;
    if (typeof specs === 'string') {
      try { specs = JSON.parse(specs); } catch { specs = undefined; }
    }

    // Only include `image` when a new file was actually uploaded
    const updatePayload = {
      ...otherFields,
      ...(req.file ? { image: `/uploads/${req.file.filename}` } : {}), // no image key → DB keeps existing
      price: Number(otherFields.price),
      originalPrice: otherFields.originalPrice ? Number(otherFields.originalPrice) : undefined,
      rating: otherFields.rating ? Number(otherFields.rating) : undefined,
      reviewsCount: otherFields.reviewsCount ? Number(otherFields.reviewsCount) : undefined,
      inStock: otherFields.inStock === 'false' ? false : otherFields.inStock === 'true' ? true : undefined,
      featured: otherFields.featured === 'false' ? false : otherFields.featured === 'true' ? true : undefined,
      category: (otherFields.category || '').toUpperCase(),
      ...(Array.isArray(specs) ? { specs } : {}),
    };

    // Remove undefined keys so Mongoose doesn't overwrite with undefined
    Object.keys(updatePayload).forEach(k => updatePayload[k] === undefined && delete updatePayload[k]);

    if (isMongoConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
      const product = await Product.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    }

    // Fallback: update in-memory array
    const { productsData: pData } = require('../data/seedData');
    const index = pData.findIndex(p => p.id === id || p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    pData[index] = { ...pData[index], ...updatePayload };
    return res.json({ success: true, data: pData[index] });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error updating product' });
  }
};

// DELETE product by ID (admin protected)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoConnected = Product.db && Product.db.readyState === 1;

    if (isMongoConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, message: 'Product deleted successfully' });
    }

    // Fallback: remove from in-memory array
    const { productsData: pData } = require('../data/seedData');
    const index = pData.findIndex(p => p.id === id || p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    pData.splice(index, 1);
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error deleting product' });
  }
};

// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const isMongoConnected = Category.db && Category.db.readyState === 1;
    if (isMongoConnected) {
      const categories = await Category.find();
      if (categories && categories.length > 0) {
        return res.json({ success: true, data: categories });
      }
    }
    return res.json({ success: true, data: categoriesData });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving categories' });
  }
};
