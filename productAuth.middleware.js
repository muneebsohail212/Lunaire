/**
 * Product Authentication Middleware (Dummy/Demonstration)
 * 
 * This middleware demonstrates how product authentication works in Express.js.
 * It checks for authentication tokens to verify access to product-related operations
 * (such as creating, updating, or deleting products).
 * 
 * Usage in routes:
 * const productAuth = require('../middleware/productAuth.middleware');
 * router.post('/', productAuth, upload.single('image'), (req, res) => { ... });
 * router.put('/:id', productAuth, (req, res) => { ... });
 * router.delete('/:id', productAuth, (req, res) => { ... });
 */

const Product = require('../models/Product');

/**
 * Middleware function to authenticate product-related requests
 * 
 * This is a dummy implementation for demonstration purposes.
 * In a real application, you would:
 * 1. Use JWT tokens or session tokens
 * 2. Verify the token signature
 * 3. Check token expiration
 * 4. Validate the user has permission to modify products
 */
const productAuth = async (req, res, next) => {
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
        message: 'Access denied. No authentication token provided for product operations.',
        error: 'Missing authentication token'
      });
    }
    
    // Step 3: Verify the token (DUMMY VERIFICATION)
    // In a real application, you would:
    // - Verify JWT signature using a secret key
    // - Check token expiration
    // - Decode the token to get user/admin ID
    
    // Dummy token validation (for demonstration only)
    // Real implementation would use: jwt.verify(token, process.env.JWT_SECRET)
    if (token === 'invalid-token' || token.length < 10) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token for product operations.',
        error: 'Token validation failed'
      });
    }
    
    // Step 4: Extract user/admin ID from token (dummy - in real app, decode JWT)
    // In real implementation: const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.userId;
    // const role = decoded.role; // e.g., 'admin', 'manager'
    
    // For demonstration, we'll use a dummy user ID
    // In production, this would come from the decoded token
    const userId = token; // Dummy: using token as ID for demo
    
    // Step 5: Check if user has permission to manage products
    // In a real application, you would check user roles/permissions
    // For demo purposes, we'll check if the token indicates admin access
    
    // Dummy permission check (in real app, check user.role === 'admin' or user.hasProductPermission)
    const hasPermission = token.includes('admin') || token.includes('manager') || token.length > 15;
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions for product operations.',
        error: 'Permission denied'
      });
    }
    
    // Step 6: For UPDATE/DELETE operations, verify the product exists
    if (req.params.id || req.params.dressid) {
      const productId = req.params.id || req.params.dressid;
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found.',
          error: 'Product does not exist'
        });
      }
      
      // Attach product to request for use in route handler
      req.product = product;
    }
    
    // Step 7: Attach user information to request object
    // This allows route handlers to know who is making the request
    req.userId = userId;
    req.authenticated = true;
    
    // Step 8: Call next() to continue to the next middleware or route handler
    next();
    
  } catch (error) {
    // Handle any errors that occur during authentication
    console.error('Product authentication error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Product authentication failed due to server error.',
      error: error.message
    });
  }
};

/**
 * Optional: Middleware to check if user has admin privileges for products
 * This is a demonstration of role-based authentication for product management
 */
const productAdminAuth = async (req, res, next) => {
  try {
    // First, run the basic product authentication
    await productAuth(req, res, () => {});
    
    // Check if user has admin privileges
    // In a real app, this would check a role field in the user model
    if (!req.authenticated) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for admin product access.'
      });
    }
    
    // Dummy admin check (in real app, check user.role === 'admin')
    const isAdmin = req.userId && (req.userId.includes('admin') || req.userId.includes('super'));
    
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required for product management.'
      });
    }
    
    next();
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Product authorization check failed.',
      error: error.message
    });
  }
};

/**
 * Optional: Middleware to check product ownership or edit permissions
 * Useful for scenarios where users can only edit their own products
 */
const productOwnerAuth = async (req, res, next) => {
  try {
    // Ensure basic authentication
    await productAuth(req, res, () => {});
    
    if (!req.params.id && !req.params.dressid) {
      return res.status(400).json({
        success: false,
        message: 'Product ID required for ownership verification.'
      });
    }
    
    const productId = req.params.id || req.params.dressid;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }
    
    // In a real app, you would check if product.ownerId === req.userId
    // or if user has admin role
    // For demo, we'll just verify the product exists (already done above)
    
    req.product = product;
    next();
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Product ownership verification failed.',
      error: error.message
    });
  }
};

module.exports = productAuth;
// Export all middleware functions if needed
// module.exports = { productAuth, productAdminAuth, productOwnerAuth };

