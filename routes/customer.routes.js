const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new customer
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, city, orders } = req.body;

    let totalSpent = 0;
    if (orders && orders.length > 0) {
      totalSpent = orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // POST new customer OR update existing one
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, city, orders } = req.body;

    // Calculate total for THIS specific order
    const orderTotal = orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Check if customer already exists
    let customer = await Customer.findOne({ email });

    if (customer) {
      // Add new orders to existing customer and update totalSpent
      customer.orders.push(...orders);
      customer.totalSpent += orderTotal;
      await customer.save();
    } else {
      // Create brand new customer
      customer = new Customer({
        name, email, phone, address, city,
        orders,
        totalSpent: orderTotal
      });
      await customer.save();
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

    const customer = new Customer({
      name,
      email,
      phone,
      address,
      city,
      orders,
      totalSpent
    });

    const savedCustomer = await customer.save();
    res.json(savedCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/customers/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, phone, address, city, country } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new customer
    const customer = new Customer({
      name,
      email,
      phone,
      address,
      city,
      country,
      // You can hash the password here if you want
    });

    await customer.save();
    res.status(201).json({ message: "Customer created successfully", customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

module.exports = router;
