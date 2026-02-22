const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// @route   POST /api/payments/razorpay/order
// @desc    Create Razorpay Order
// @access  Private
router.post('/razorpay/order', protect, async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message,
        });
    }
});

// @route   POST /api/payments/razorpay/verify
// @desc    Verify Razorpay Payment
// @access  Private
router.post('/razorpay/verify', protect, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update our database order
            if (orderId) {
                const order = await Order.findById(orderId);
                if (order) {
                    order.paymentStatus = 'completed';
                    order.paymentDetails = {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature
                    };
                    await order.save();
                }
            }

            res.json({
                success: true,
                message: 'Payment verified successfully',
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    } catch (error) {
        console.error('Razorpay Verify Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during verification',
        });
    }
});

module.exports = router;
