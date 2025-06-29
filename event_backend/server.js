// sky_event_backend/server.js (for Render + MongoDB Atlas)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

// Login Route
app.post('/login/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ status: 'not_found' });
    if (user.password !== password) return res.json({ status: 'wrong_password' });

    res.json({ status: 'success', name: user.name, phone: user.phone });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Register Route
app.post('/register/', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ status: 'exists' });

    const newUser = new User({ name, email, phone, password });
    await newUser.save();
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Booking Schema & Route
const BookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  guests: Number,
  payment: String,
  package: String
});

const Booking = mongoose.model('Booking', BookingSchema);

app.post('/booking/', async (req, res) => {
  const { name, email, phone, date, guests, payment, packageName } = req.body;

  try {
    const newBooking = new Booking({ name, email, phone, date, guests, payment, package: packageName });
    await newBooking.save();
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
