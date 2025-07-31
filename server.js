const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const businessRoutes = require('./routes/businessRoutes');
const investorRoutes = require('./routes/investorRoutes');
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/business', businessRoutes);
app.use('/api/investor', investorRoutes);

// ✅ Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
  }
}

startServer();
