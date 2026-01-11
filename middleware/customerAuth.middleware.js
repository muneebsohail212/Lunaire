

const Customer = require('../models/customer');

const customerAuth = async (req, res, next) => {
  try {
    // Step 1: Extract the token from the request
    // Common methods: Authorization header, cookies, or query parameters
    
    // Method 1: From Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    
    // Method 2: From cookies (alternative method)
    // token = req.cookies?.authToken;
    
    // Method 3: From query parameter (less secure, for demo only)
    // token = req.query.token;
    
    // Step 2: Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
        error: 'Missing authentication token'
      });
    }
    
    // Step 3: Verify the token (DUMMY VERIFICATION)
    // In a real application, you would:
    // - Verify JWT signature using a secret key
    // - Check token expiration
    // - Decode the token to get customer ID
    
    // Dummy token validation (for demonstration only)
    // Real implementation would use: jwt.verify(token, process.env.JWT_SECRET)
    if (token === 'invalid-token' || token.length < 10) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
        error: 'Token validation failed'
      });
    }
    
    // Step 4: Extract customer ID from token (dummy - in real app, decode JWT)
    // In real implementation: const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const customerId = decoded.customerId;
    
    // For demonstration, we'll use a dummy customer ID
    // In production, this would come from the decoded token
    const customerId = token; // Dummy: using token as ID for demo
    
    // Step 5: Verify customer exists in database
    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Customer not found. Invalid authentication.',
        error: 'Customer does not exist'
      });
    }
    
    // Step 6: Attach customer information to request object
    // This allows route handlers to access the authenticated customer
    req.customer = customer;
    req.customerId = customer._id;
    
    // Step 7: Call next() to continue to the next middleware or route handler
    next();
    
  } catch (error) {
    // Handle any errors that occur during authentication
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
 * This is a demonstration of role-based authentication
 */
const customerAdminAuth = async (req, res, next) => {
  try {
    // First, run the basic customer authentication
    await customerAuth(req, res, () => {});
    
    // Check if customer has admin privileges
    // In a real app, this would check a role field in the customer model
    if (!req.customer) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for admin access.'
      });
    }
    
    // Dummy admin check (in real app, check customer.role === 'admin')
    if (req.customer.email && req.customer.email.includes('admin')) {
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

