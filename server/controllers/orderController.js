const Order = require('../models/Order');

// In-memory order fallback storage (used when MongoDB is not connected)
const inMemoryOrders = [];

/**
 * POST /api/orders
 * Creates a new order and persists it in MongoDB (or in-memory as fallback).
 * Item objects must contain: { productId?, title, price, quantity, image? }
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      city,
      paymentMethod,
      items,
      subtotal,
      shipping,
      totalAmount,
    } = req.body;

    // --- Validation ---
    if (!customerName || !email || !address) {
      return res.status(400).json({
        success: false,
        message: 'customerName, email, and address are required',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required',
      });
    }

    // Normalise each item so the aggregation pipeline always has
    // quantity (number) and price (number) to multiply together.
    const normalisedItems = items.map(item => ({
      productId: item.productId || null,
      title: item.title || 'Unknown Product',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || '',
    }));

    const computedSubtotal = normalisedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const orderData = {
      customerName,
      email,
      phone: phone || 'N/A',
      address,
      city: city || 'Colombo',
      paymentMethod: paymentMethod || 'CARD',
      items: normalisedItems,
      subtotal: typeof subtotal === 'number' ? subtotal : computedSubtotal,
      shipping: Number(shipping) || 0,
      totalAmount: typeof totalAmount === 'number' ? totalAmount : computedSubtotal + (Number(shipping) || 0),
      status: 'Processing',
    };

    const isMongoConnected = Order.db && Order.db.readyState === 1;

    if (isMongoConnected) {
      const newOrder = await Order.create(orderData);
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        data: newOrder,
      });
    }

    // Fallback: in-memory (demo / no-DB mode)
    const fallbackOrder = { ...orderData, orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000), createdAt: new Date() };
    inMemoryOrders.push(fallbackOrder);
    return res.status(201).json({
      success: true,
      message: 'Order confirmed (Demo Mode — no DB)',
      data: fallbackOrder,
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

/**
 * GET /api/orders
 * Returns all orders, newest first.
 */
exports.getOrders = async (req, res) => {
  try {
    const isMongoConnected = Order.db && Order.db.readyState === 1;
    if (isMongoConnected) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: orders });
    }
    return res.json({ success: true, data: [...inMemoryOrders].reverse() });
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};
