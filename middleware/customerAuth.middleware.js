const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

/**
 * Customer Authentication Middleware
 * Verifies JWT tokens and attaches customer to request object
 */
const customerAuth = async (req, res, next) => {
  try {
    // Step 1: Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    
    // Step 2: Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
        error: 'Missing authentication token'
      });
    }
    
    // Step 3: Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    // Step 4: Extract customer ID from decoded token
    const customerId = decoded.customerId;
    
    // Step 5: Verify customer exists in database
    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Customer not found. Invalid authentication.',
        error: 'Customer does not exist'
      });
    }
    
    // Step 6: Check if customer account is active
    if (!customer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.',
        error: 'Account inactive'
      });
    }
    
    // Step 7: Attach customer information to request object
    req.customer = customer;
    req.customerId = customer._id;
    
    // Step 8: Call next() to continue to the next middleware or route handler
    next();
    
  } catch (error) {
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
        error: 'Token validation failed'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please login again.',
        error: 'Token expired'
      });
    }
    
    // Handle other errors
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed due to server error.',
      error: error.message
    });
  }
};

/**
 * Optional: Middleware to check if customer has admin/privileged access
 * This checks for admin or manager role
 */
const customerAdminAuth = async (req, res, next) => {
  try {
    // First, run the basic customer authentication
    await customerAuth(req, res, () => {});
    
    // Check if customer has admin privileges
    if (!req.customer) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for admin access.'
      });
    }
    
    // Check if customer has admin or manager role
    if (req.customer.role === 'admin' || req.customer.role === 'manager') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed.',
      error: error.message
    });
  }
};

module.exports = customerAuth;
// Export both middleware functions if needed
// module.exports = { customerAuth, customerAdminAuth };

