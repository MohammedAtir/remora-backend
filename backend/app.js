// app.js
const express = require('express');
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true, // keep true even if you don't use cookies (nice for later)
}));

const dotenv = require('dotenv');

dotenv.config();

// Assuming your route files are located in a 'routes' folder
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const investorRoutes = require('./routes/investorRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api/transaction', transactionRoutes);

// Error handling can be added here
// app.use(errorHandler);

// Correctly export the Express app instance so tests can import it
module.exports = app;
