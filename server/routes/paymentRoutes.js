const express = require('express');
const router = express.Router();
const { initiatePayment, paymentNotify } = require('../controllers/paymentController');

// POST /api/payment/initiate
router.post('/initiate', initiatePayment);

// POST /api/payment/notify
router.post('/notify', paymentNotify);

module.exports = router;
