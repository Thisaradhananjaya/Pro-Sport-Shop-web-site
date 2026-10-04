const crypto = require('crypto');

/**
 * initiatePayment
 * POST /api/payment/initiate
 * ─────────────────────────────────────────────────────────────────
 * Generates PayHere payment payload with cryptographic MD5 hash
 * formula required by PayHere Sandbox/Live API.
 */
const initiatePayment = async (req, res) => {
  try {
    const { orderId, amount, currency = 'LKR', customer = {} } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'orderId and amount are required',
      });
    }

    const merchantId     = process.env.PAYHERE_MERCHANT_ID || '1238481';
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '';
    const actionUrl      = process.env.PAYHERE_ACTION_URL || 'https://sandbox.payhere.lk/pay/checkout';

    // 1. Format amount to 2 decimal places (e.g. 29500.00)
    const formattedAmount = parseFloat(amount).toFixed(2);
    const upperCurrency   = currency.toUpperCase();

    // 2. PayHere MD5 Hash Generation:
    //    hashedSecret = MD5(merchantSecret).toUpperCase()
    //    hash = MD5(merchantId + orderId + formattedAmount + currency + hashedSecret).toUpperCase()
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const hashString = `${merchantId}${orderId}${formattedAmount}${upperCurrency}${hashedSecret}`;
    const hash = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    // 3. Build Payment Data
    const paymentData = {
      merchant_id: merchantId,
      return_url:  'http://localhost:3000/payment/success',
      cancel_url:  'http://localhost:3000/payment/cancel',
      notify_url:  'http://localhost:5000/api/payment/notify',
      order_id:    orderId,
      items:       req.body.items || '1x Nike Pegasus 40',
      currency:    upperCurrency,
      amount:      formattedAmount,
      first_name:  customer.firstName || customer.first_name || 'Customer',
      last_name:   customer.lastName || customer.last_name || '',
      email:       customer.email || 'customer@example.com',
      phone:       customer.phone || '0771234567',
      address:     customer.address || 'Colombo',
      city:        customer.city || 'Colombo',
      country:     customer.country || 'Sri Lanka',
      hash:        hash,
    };

    console.log(`💳 [PayHere Initiate] Order: ${orderId} | Amount: ${upperCurrency} ${formattedAmount} | Hash: ${hash}`);

    return res.status(200).json({
      success: true,
      paymentData,
      actionUrl,
    });
  } catch (error) {
    console.error('❌ [PayHere Initiate Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message,
    });
  }
};

/**
 * paymentNotify
 * POST /api/payment/notify
 * ─────────────────────────────────────────────────────────────────
 * PayHere server-to-server webhook endpoint
 * Verifies md5sig and processes order status
 */
const paymentNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id,
      status_message,
    } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '';

    // Calculate MD5 hash for verification:
    // localMd5sig = MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret).toUpperCase()
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const localSignatureString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;
    const localMd5sig = crypto
      .createHash('md5')
      .update(localSignatureString)
      .digest('hex')
      .toUpperCase();

    // Verify authenticity
    const isAuthentic = (localMd5sig === md5sig);

    console.log('\n🔔 ══════════ PAYHERE PAYMENT NOTIFICATION ══════════');
    console.log(`   Order ID:        ${order_id}`);
    console.log(`   Payment ID:      ${payment_id}`);
    console.log(`   Amount:          ${payhere_currency} ${payhere_amount}`);
    console.log(`   Status Code:     ${status_code}`);
    console.log(`   Status Message:  ${status_message}`);
    console.log(`   Signature Valid: ${isAuthentic ? '✅ YES' : '❌ NO'}`);

    if (!isAuthentic) {
      console.warn('⚠️  [PayHere Warning] Invalid md5 signature received.');
      return res.status(400).send('Invalid signature');
    }

    // Status Code Mapping:
    //  2  = SUCCESS
    //  0  = PENDING
    // -1  = CANCELED
    // -2  = FAILED
    // -3  = CHARGEDBACK
    switch (String(status_code)) {
      case '2':
        console.log(`✅ [PAYMENT SUCCESS] Order ${order_id} was paid successfully! (Payment ID: ${payment_id})`);
        break;
      case '0':
        console.log(`⏳ [PAYMENT PENDING] Order ${order_id} is pending authorization.`);
        break;
      case '-1':
        console.log(`🚫 [PAYMENT CANCELED] Order ${order_id} was cancelled by user.`);
        break;
      case '-2':
        console.log(`❌ [PAYMENT FAILED] Order ${order_id} payment failed.`);
        break;
      case '-3':
        console.log(`⚠️  [PAYMENT CHARGEDBACK] Order ${order_id} was charged back.`);
        break;
      default:
        console.log(`ℹ️  [PAYMENT STATUS] Order ${order_id} status code: ${status_code}`);
    }
    console.log('═════════════════════════════════════════════════════\n');

    return res.status(200).send('OK');
  } catch (error) {
    console.error('❌ [PayHere Notify Error]:', error.message);
    return res.status(500).send('Server Error');
  }
};

module.exports = {
  initiatePayment,
  paymentNotify,
};
