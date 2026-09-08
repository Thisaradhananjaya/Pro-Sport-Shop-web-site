const Product = require('../models/Product');
const Category = require('../models/Category');
const { productsData, categoriesData } = require('../data/seedData');

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
exports.createProduct = async (req, res) => {
  try {
    const isMongoConnected = Product.db && Product.db.readyState === 1;

    if (isMongoConnected) {
      const product = await Product.create(req.body);
      return res.status(201).json({ success: true, data: product });
    }

    // Fallback: add to in-memory array
    const { productsData } = require('../data/seedData');
    const newProduct = {
      id: 'prod-' + Date.now(),
      ...req.body,
      category: req.body.category.toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    productsData.push(newProduct);
    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating product' });
  }
};

// PUT update product by ID (admin protected)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoConnected = Product.db && Product.db.readyState === 1;

    if (isMongoConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
      const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    }

    // Fallback: update in-memory array
    const { productsData } = require('../data/seedData');
    const index = productsData.findIndex(p => p.id === id || p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    productsData[index] = { ...productsData[index], ...req.body, category: req.body.category?.toUpperCase() || productsData[index].category };
    return res.json({ success: true, data: productsData[index] });
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
    const { productsData } = require('../data/seedData');
    const index = productsData.findIndex(p => p.id === id || p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    productsData.splice(index, 1);
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
