const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const dummyCustomers = [
  { name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'user' },
  { name: 'Michael Chen', email: 'm.chen@example.com', role: 'user' },
  { name: 'Emma Watson', email: 'emma@example.com', role: 'user' },
  { name: 'David Kim', email: 'd.kim@example.com', role: 'user' },
  { name: 'Sophia Martinez', email: 'sophia.m@example.com', role: 'user' },
];

const seedOrders = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/luxe-ecommerce";
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    // 1. Fetch available products
    const dbProducts = await Product.find({});
    if (dbProducts.length === 0) {
      console.error('No products found in database. Please run product seeding first: node seedProducts.js');
      process.exit(1);
    }
    console.log(`Found ${dbProducts.length} products to build orders with.`);

    // 2. Clear existing orders and dummy users
    await Order.deleteMany({});
    console.log('Cleared existing orders.');
    
    // Clear and re-create dummy customers
    const customerEmails = dummyCustomers.map(c => c.email);
    await User.deleteMany({ email: { $in: customerEmails } });
    console.log('Cleared existing dummy users.');

    const passwordHash = await bcrypt.hash('password123', 10);
    const createdUsers = [];

    for (const cust of dummyCustomers) {
      const user = await User.create({
        name: cust.name,
        email: cust.email,
        password: passwordHash,
        role: cust.role,
        addresses: [
          {
            fullName: cust.name,
            phone: '9876543210',
            addressLine1: '123 Luxe Boulevard',
            addressLine2: 'Suite 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India',
            addressType: 'Home',
            isDefault: true,
          }
        ]
      });
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} dummy customers.`);

    // 3. Generate orders spread over the last 6 months
    const now = new Date();
    const orderStatuses = ['delivered', 'delivered', 'shipped', 'pending', 'cancelled'];
    const paymentMethods = ['ONLINE', 'COD'];

    const ordersToInsert = [];

    // Let's generate 40 mock orders
    for (let i = 0; i < 40; i++) {
      // Pick random customer
      const customer = createdUsers[Math.floor(Math.random() * createdUsers.length)];

      // Pick 1 to 3 random products
      const orderProducts = [];
      const numItems = Math.floor(Math.random() * 3) + 1;
      let cartTotal = 0;

      // Keep track of picked product IDs to avoid duplicates in the same order
      const pickedIds = new Set();

      for (let j = 0; j < numItems; j++) {
        const prod = dbProducts[Math.floor(Math.random() * dbProducts.length)];
        if (pickedIds.has(prod._id.toString())) continue;
        pickedIds.add(prod._id.toString());

        const quantity = Math.floor(Math.random() * 2) + 1; // 1 or 2 units
        const price = prod.price;
        
        cartTotal += price * quantity;
        orderProducts.push({
          productId: prod._id,
          quantity,
          price,
        });
      }

      if (orderProducts.length === 0) continue;

      const discount = Math.random() > 0.7 ? parseFloat((cartTotal * 0.1).toFixed(2)) : 0; // 10% discount sometimes
      const totalAmount = parseFloat((cartTotal - discount).toFixed(2));

      // Distribute dates over past 6 months (roughly Jan to Jul 2026)
      const orderDate = new Date(now);
      const daysAgo = Math.floor(Math.random() * 180); // Up to 180 days ago
      orderDate.setDate(now.getDate() - daysAgo);

      // Random status and payment status
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentStatus = status === 'delivered' || status === 'shipped' || Math.random() > 0.5 ? 'paid' : 'pending';
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      ordersToInsert.push({
        user: customer._id,
        products: orderProducts,
        cartTotal,
        discount,
        totalAmount,
        status,
        paymentStatus,
        paymentMethod,
        createdAt: orderDate,
        updatedAt: orderDate,
      });
    }

    // Insert orders directly to database
    const createdOrders = await Order.insertMany(ordersToInsert);
    console.log(`Seeded ${createdOrders.length} orders successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('Failed to seed orders:', err);
    process.exit(1);
  }
};

seedOrders();
