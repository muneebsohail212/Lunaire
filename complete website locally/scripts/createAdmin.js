/**
 * Script to create an admin user
 * Run with: node scripts/createAdmin.js
 */

const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists with email: admin@example.com');
      console.log('To create a new admin, change the email in this script or use a different email.');
      process.exit(0);
    }

    // Create default admin
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed automatically
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

