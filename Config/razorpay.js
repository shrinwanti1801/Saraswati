const Razorpay = require('razorpay');
require('dotenv').config();

exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_DEFAULT_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_DEFAULT_KEY_SECRET',
});