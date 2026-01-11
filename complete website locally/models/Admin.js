const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin Schema with Authentication Support
 */

const adminSchema = new mongoose.Schema({
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
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  
  isActive: {
    type: Boolean,
    default: true
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
 */
adminSchema.pre('save', async function(next) {
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
 */
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Static Method: Find admin by email
 */
adminSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Static Method: Find admin by credentials (email and password)
 */
adminSchema.statics.findByCredentials = async function(email, password) {
  const admin = await this.findOne({ email: email.toLowerCase() }).select('+password');
  
  if (!admin) {
    throw new Error('Invalid login credentials');
  }
  
  const isMatch = await admin.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }
  
  if (!admin.isActive) {
    throw new Error('Account is inactive');
  }
  
  return admin;
};

module.exports = mongoose.model('Admin', adminSchema);

