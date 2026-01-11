const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Customer Schema with Authentication Support
 * 
 * This schema includes fields and methods necessary for customer authentication.
 * In a real application, passwords would be hashed before saving to the database.
 */

const customerSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  
  // Authentication Fields
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't return password by default when querying
  },
  
  role: {
    type: String,
    enum: ['customer', 'admin', 'manager'],
    default: 'customer'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isVerified: {
    type: Boolean,
    default: false // Email verification status
  },
  
  // Optional: Token fields for password reset or email verification
  resetPasswordToken: {
    type: String,
    select: false
  },
  
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  
  verificationToken: {
    type: String,
    select: false
  },
  
  // Existing Business Fields
  orders: { 
    type: Number, 
    default: 0 
  },
  
  spent: { 
    type: Number, 
    default: 0 
  },
  
  joinDate: { 
    type: Date, 
    default: Date.now 
  },
  
  // Optional: Last login tracking
  lastLogin: {
    type: Date
  }
  
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

/**
 * Pre-save Middleware: Hash password before saving
 * This runs automatically before saving a customer document
 * 
 * In a real application, you would use:
 * this.password = await bcrypt.hash(this.password, 10);
 */
customerSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash the password with bcrypt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});

/**
 * Instance Method: Compare password with hashed password
 * Used during login to verify the provided password
 * 
 * Usage: const isMatch = await customer.comparePassword('userPassword123');
 */
customerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance Method: Generate password reset token
 * Useful for "forgot password" functionality
 */
customerSchema.methods.generateResetToken = function() {
  // In a real application, you would generate a secure random token
  // const crypto = require('crypto');
  // const resetToken = crypto.randomBytes(32).toString('hex');
  // this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  // return resetToken;
  
  // Dummy implementation
  const resetToken = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

/**
 * Instance Method: Check if customer is admin
 * Helper method for authorization checks
 */
customerSchema.methods.isAdmin = function() {
  return this.role === 'admin' || this.role === 'manager';
};

/**
 * Static Method: Find customer by email
 * Useful for login operations
 */
customerSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Static Method: Find customer by credentials (email and password)
 * Combines email lookup and password verification
 */
customerSchema.statics.findByCredentials = async function(email, password) {
  const customer = await this.findOne({ email: email.toLowerCase() }).select('+password');
  
  if (!customer) {
    throw new Error('Invalid login credentials');
  }
  
  const isMatch = await customer.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }
  
  if (!customer.isActive) {
    throw new Error('Account is inactive');
  }
  
  return customer;
};

module.exports = mongoose.model('Customer', customerSchema);
