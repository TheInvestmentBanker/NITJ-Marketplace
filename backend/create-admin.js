require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

async function run() {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.MONGO_URI) {
    console.error('Set ADMIN_USERNAME, ADMIN_PASSWORD and MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const exists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
  if (exists) {
    console.log('Admin already exists. Exiting.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const admin = new Admin({ username: process.env.ADMIN_USERNAME, password: hashed });
  await admin.save();
  console.log('Admin created:', process.env.ADMIN_USERNAME);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
