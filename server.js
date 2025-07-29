// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const businessRoutes = require('./routes/businessRoutes');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/business', businessRoutes);

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
