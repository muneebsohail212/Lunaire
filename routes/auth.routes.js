const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

// Generate JWT Token
const generateToken = (customerId) => {
  return jwt.sign({ customerId }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
    expiresIn: '7d'
  });
};

// @route   POST /api/customers/signup
// @desc    Register a new customer
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }

    // Create new customer
    const customer = new Customer({
      name,
      email: email.toLowerCase(),
      password
    });

    await customer.save();

    // Generate token
    const token = generateToken(customer._id);

    // Return customer data (without password) and token
    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// @route   POST /api/customers/login
// @desc    Login customer
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find customer and include password field
    const customer = await Customer.findOne({ email: email.toLowerCase() }).select('+password');

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!customer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    // Compare password
    const isPasswordValid = await customer.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    customer.lastLogin = new Date();
    await customer.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(customer._id);

    // Return customer data (without password) and token
    res.json({
      success: true,
      message: 'Login successful',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// @route   GET /api/customers/me
// @desc    Get current logged in customer
// @access  Private (requires authentication middleware)
router.get('/me', async (req, res) => {
  try {
    // This route should be protected by customerAuth middleware
    // req.customer will be set by the middleware
    const customer = await Customer.findById(req.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role,
        orders: customer.orders,
        spent: customer.spent,
        joinDate: customer.joinDate
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;

