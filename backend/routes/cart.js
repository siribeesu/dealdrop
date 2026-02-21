const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');

    res.json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, quantity } = req.body;

    // Check if product exists and is available
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Product not available or insufficient stock'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if item already in cart
    const existingItem = user.cart.find(item =>
      item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      user.cart.push({
        product: productId,
        quantity
      });
    }

    await user.save();
    await user.populate('cart.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: user.cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/:productId', [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { quantity } = req.body;
    const user = await User.findById(req.user.id);

    // Find cart item
    const cartItem = user.cart.find(item =>
      item.product.toString() === req.params.productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity === 0) {
      // Remove item from cart
      user.cart = user.cart.filter(item =>
        item.product.toString() !== req.params.productId
      );
    } else {
      // Check stock availability
      const product = await Product.findById(req.params.productId);
      if (!product.isAvailable(quantity)) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }

      cartItem.quantity = quantity;
    }

    await user.save();
    await user.populate('cart.product');

    res.json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
      cart: user.cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Remove item from cart
    user.cart = user.cart.filter(item =>
      item.product.toString() !== req.params.productId
    );

    await user.save();
    await user.populate('cart.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: user.cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/cart/merge
// @desc    Merge guest cart with user cart
// @access  Private
router.post('/merge', async (req, res) => {
  try {
    const { guestCart } = req.body; // Array of { productId, quantity }
    const user = await User.findById(req.user.id);

    for (const guestItem of guestCart) {
      const product = await Product.findById(guestItem.productId);
      if (!product || !product.isAvailable(guestItem.quantity)) {
        continue; // Skip unavailable items
      }

      const existingItem = user.cart.find(item =>
        item.product.toString() === guestItem.productId
      );

      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        user.cart.push({
          product: guestItem.productId,
          quantity: guestItem.quantity
        });
      }
    }

    await user.save();
    await user.populate('cart.product');

    res.json({
      success: true,
      message: 'Cart merged successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
