const express = require('express');
const router  = express.Router();
const {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  upload,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/',            getProducts);
router.get('/categories',  getCategories);
router.get('/:id',         getProductById);

// Admin-protected routes
// upload.single('image') parses multipart/form-data and attaches req.file
router.post('/',    protect, upload.single('image'), createProduct);
router.put('/:id',  protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
