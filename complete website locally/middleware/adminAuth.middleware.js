const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Admin Authentication Middleware
 * Verifies JWT tokens and attaches admin to request object
 */
const adminAuth = async (req, res, next) => {
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
    
    // Step 4: Extract admin ID from decoded token
    const adminId = decoded.adminId;
    
    // Step 5: Verify admin exists in database
    const admin = await Admin.findById(adminId);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found. Invalid authentication.',
        error: 'Admin does not exist'
      });
    }
    
    // Step 6: Check if admin account is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.',
        error: 'Account inactive'
      });
    }
    
    // Step 7: Attach admin information to request object
    req.admin = admin;
    req.adminId = admin._id;
    
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
    console.error('Admin authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed due to server error.',
      error: error.message
    });
  }
};

module.exports = adminAuth;

