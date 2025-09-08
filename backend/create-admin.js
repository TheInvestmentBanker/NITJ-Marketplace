const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

async function createAdmin() {
  // Validate required environment variables
  const { ADMIN_USERNAME, ADMIN_PASSWORD, MONGO_URI } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !MONGO_URI) {
    console.error('Missing required environment variables: ADMIN_USERNAME, ADMIN_PASSWORD, or MONGO_URI');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: ADMIN_USERNAME });
    if (existingAdmin) {
      console.log(`Admin with username ${ADMIN_USERNAME} already exists. Exiting.`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password and create admin
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = new Admin({ username: ADMIN_USERNAME, password: hashedPassword });
    await admin.save();
    console.log(`Admin created successfully with username: ${ADMIN_USERNAME}`);
    
    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();