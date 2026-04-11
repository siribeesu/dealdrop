const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/email');
const sendSMS = require('../utils/sms');
const { protect } = require('../middleware/auth');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

// Helper to create token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @route   POST /api/auth/google-login
// @desc    Login/Register with Google
// @access  Public
router.post('/google-login', async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, family_name, given_name, sub: googleId, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        firstName: given_name,
        lastName: family_name || ' ',
        email,
        googleId,
        isVerified: true, // Google accounts are pre-verified
        profile: { avatar: picture }
      });
    } else if (!user.googleId) {
      // Link Google ID if user exists but hasn't linked yet
      user.googleId = googleId;
      user.isVerified = true;
      if (!user.profile.avatar) user.profile.avatar = picture;
      await user.save();
    }

    const token = createToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.profile.avatar
      }
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(400).json({ success: false, message: 'Google login failed' });
  }
});

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email/phone
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    let query = {};
    if (email) query.email = email;
    else if (phoneNumber) query.phoneNumber = phoneNumber;
    else return res.status(400).json({ success: false, message: 'Email or phone number is required' });

    let user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found. Please sign up.' });
    }

    const otp = user.generateOTP();
    await user.save();

    // Fallback log to console so user can always see the OTP in terminal
    console.log(`\n-----------------------------------------`);
    console.log(`🔑 VERIFICATION OTP: ${otp}`);
    console.log(`👤 FOR IDENTITY: ${user.email || user.phoneNumber}`);
    console.log(`-----------------------------------------\n`);

    if (user.email) {
      try {
        await sendEmail({
          email: user.email,
          subject: 'One-Time Password (OTP) - DealDrop',
          message: `Your OTP for verification is: ${otp}. Valid for 10 minutes.`,
          html: `
            <div style="font-family: sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #1E3A8A;">Verification Code</h2>
              <p>Use the following 6-digit code to verify your account:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #F97316; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 12px;">Valid for 10 minutes. Do not share this with anyone.</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('⚠️ SMTP Failed but OTP is available in console.');
      }
    }

    if (user.phoneNumber) {
      // Send Real SMS
      await sendSMS(
        user.phoneNumber,
        `Your DealDrop verification code is: ${otp}`
      );
    }

    res.json({ 
      success: true, 
      message: user.email ? 'OTP sent to your email' : 'OTP sent to your phone' 
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/verify
// @access  Public
// @route   POST /api/auth/register-otp
// @desc    Send OTP to email/phone for registration
// @access  Public
router.post('/register-otp', async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    
    if (!email && !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Email or Phone Number is required' });
    }

    // Check if user already exists
    let query = [];
    if (email) query.push({ email });
    if (phoneNumber) query.push({ phoneNumber });

    const existingUser = await User.findOne({ $or: query });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Account already exists with this identity.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const identity = email || phoneNumber;

    // Save/Update OTP in temporary collection
    await OTP.findOneAndUpdate(
      { identity },
      { otp, expiresAt: Date.now() + 10 * 60 * 1000 },
      { upsert: true }
    );

    // Terminal Logging (Fallback)
    console.log(`\n-----------------------------------------`);
    console.log(`🔑 REGISTRATION OTP: ${otp}`);
    console.log(`👤 FOR: ${identity}`);
    console.log(`-----------------------------------------\n`);

    // Send SMS if applicable
    if (phoneNumber) {
      await sendSMS(
        phoneNumber,
        `DealDrop Registration Code: ${otp}`
      );
    }
    if (email) {
      try {
        await sendEmail({
          email,
          subject: 'Verify Your DealDrop Account',
          message: `Your verification code is: ${otp}`,
          html: `
            <div style="font-family: sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #1E3A8A;">Welcome to DealDrop!</h2>
              <p>Use the following code to verify your identity and create your account:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #F97316; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 12px;">Valid for 10 minutes. Do not share this with anyone.</p>
            </div>
          `
        });
      } catch (err) { console.error('SMTP Error:', err.message); }
    }

    res.json({ success: true, message: 'Verification code sent!' });
  } catch (error) {
    console.error('Register OTP Error:', error);
    res.status(500).json({ success: false, message: 'Process failed' });
  }
});

// @route   POST /api/auth/register-verify
// @desc    Verify OTP and CREATE user account
// @access  Public
router.post('/register-verify', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, otp } = req.body;
    const identity = email || phoneNumber;

    console.log(`[DEBUG] Verify Request for: ${identity} with OTP: ${otp}`);

    if (!identity) {
      return res.status(400).json({ success: false, message: 'Identity missing' });
    }

    // 1. Verify OTP from temporary collection
    const otpRecord = await OTP.findOne({ identity, otp });
    console.log(`[DEBUG] OTP Record found:`, otpRecord ? 'YES' : 'NO');
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code' });
    }

    // 2. Check for race condition
    const existingUser = await User.findOne({ 
      $or: [
        email ? { email } : { _none: 1 }, 
        phoneNumber ? { phoneNumber } : { _none: 1 }
      ] 
    });
    console.log(`[DEBUG] Existing User Check:`, existingUser ? 'FOUND' : 'NONE');
    
    if (existingUser) {
      await OTP.deleteOne({ identity, otp });
      return res.status(400).json({ success: false, message: 'Account already exists.' });
    }

    // 3. Clear the OTP record
    await OTP.deleteOne({ identity, otp });

    // 4. Create the account
    console.log(`[DEBUG] Attempting User.create for: ${firstName} ${lastName}`);
    const userPayload = {
      firstName,
      lastName,
      password,
      isVerified: true
    };
    if (email) userPayload.email = email;
    if (phoneNumber) userPayload.phoneNumber = phoneNumber;

    const user = await User.create(userPayload);
    console.log(`[DEBUG] User created successfully:`, user._id);

    const token = createToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Registration Verify Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Account already exists.' });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create account',
      debug_error: error.message 
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
// Legacy register removed - replaced by register-otp and register-verify.
// Legacy verify-otp removed - replaced by logic above and/or standard OTP login.

// Re-implementing a simple verify-otp for LOGIN recovery if needed
router.post('/login-verify-otp', async (req, res) => {
  try {
    const { email, phoneNumber, otp } = req.body;
    let query = { otp, otpExpires: { $gt: Date.now() } };
    if (email) query.email = email;
    else if (phoneNumber) query.phoneNumber = phoneNumber;
    
    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ success: false, message: 'Invalid code' });

    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    
    const token = createToken(user);
    res.json({ success: true, token, user });
  } catch (err) { res.status(500).json({ success: false }); }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    let query = {};
    if (email) query.email = email;
    else if (phoneNumber) query.phoneNumber = phoneNumber;
    else return res.status(400).json({ success: false, message: 'Email or phone number is required' });

    // Check if user exists
    const user = await User.findOne(query).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified && user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Please verify your account to access your account.' });
    }

    // Create token
    const token = createToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Auth Route Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/verify/:token
// @desc    Verify email
// @access  Public
router.post('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Private
router.post('/resend-verification', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
    const message = `Please click the link below to verify your email:\n\n${verificationUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification - DealDrop',
        message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to DealDrop!</h2>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
        `
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/public-resend-verification
// @desc    Resend verification email (Public)
// @access  Public
router.post('/public-resend-verification', async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    let query = {};
    if (email) query.email = email;
    else if (phoneNumber) query.phoneNumber = phoneNumber;
    else return res.status(400).json({ success: false, message: 'Email or phone number is required' });

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    if (user.email) {
      try {
        await sendEmail({
          email: user.email,
          subject: 'Account Verification Code - DealDrop',
          message: `Your verification code is: ${otp}`,
          html: `
            <div style="font-family: sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #1E3A8A;">Verification Code</h2>
              <p>You requested a new verification code for your DealDrop account.</p>
              <p>Use the following 6-digit code to verify your account:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #F97316; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 12px;">Valid for 10 minutes. Do not share this with anyone.</p>
            </div>
          `
        });
      } catch (error) {
        console.error('Email sending failed:', error);
      }
    }

    if (user.phoneNumber) {
      console.log(`[SMS MOCK] Resending OTP ${otp} to phone: ${user.phoneNumber}`);
    }

    res.json({
      success: true,
      message: 'Verification code sent successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Please enter a valid email')
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

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset - DealDrop',
        message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>You requested a password reset for your DealDrop account.</p>
            <p>Please click the button below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email'
      });
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

    const user = await User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.profile,
        cart: user.cart,
        wishlist: user.wishlist,
        orders: user.orders
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', [
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Please enter a valid email')
], protect, async (req, res) => {
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

    const user = await User.findById(req.user.id);

    // Update fields
    const allowedFields = ['firstName', 'lastName', 'email'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Update profile fields
    if (req.body.profile) {
      user.profile = { ...user.profile, ...req.body.profile };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], protect, async (req, res) => {
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

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = req.body.newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    const updatedUser = await User.findById(req.user.id).populate('wishlist');
    res.json({ success: true, wishlist: updatedUser.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/auth/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    const updatedUser = await User.findById(req.user.id).populate('wishlist');
    res.json({ success: true, wishlist: updatedUser.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/auth/wishlist
// @desc    Get user wishlist with product details
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
