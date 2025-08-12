// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const investorRoutes = require('./routes/investorRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api/transaction', transactionRoutes);

app.use(errorHandler);

module.exports = app;
