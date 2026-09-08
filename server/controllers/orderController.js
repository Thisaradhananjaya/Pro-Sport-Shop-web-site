const Order = require('../models/Order');

// In-memory order fallback storage
const inMemoryOrders = [];

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { customerName, email, phone, address, city, paymentMethod, items, subtotal, shipping, totalAmount } = req.body;

    if (!customerName || !email || !address || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide all required order details' });
    }

    const orderData = {
      orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      customerName,
      email,
      phone,
      address,
      city: city || 'Colombo',
      paymentMethod: paymentMethod || 'CARD',
      items,
      subtotal,
      shipping: shipping || 0,
      totalAmount,
      status: 'Processing',
      createdAt: new Date(),
    };

    const isMongoConnected = Order.db && Order.db.readyState === 1;

    if (isMongoConnected) {
      const newOrder = await Order.create(orderData);
      return res.status(201).json({ success: true, message: 'Order placed successfully!', data: newOrder });
    }

    inMemoryOrders.push(orderData);
    return res.status(201).json({
      success: true,
      message: 'Order confirmed successfully! (Demo Mode)',
      data: orderData
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

// GET orders
exports.getOrders = async (req, res) => {
  try {
    const isMongoConnected = Order.db && Order.db.readyState === 1;
    if (isMongoConnected) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: orders });
    }
    return res.json({ success: true, data: inMemoryOrders });
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};
