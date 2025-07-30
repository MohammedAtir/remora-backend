// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {businessRoutes} = require('./routes/businessRoutes');
const {investorRoutes} = require('./routes/investorRoutes');
const cors = require ("cors")

// Load environment variables
dotenv.config();
// Initialize Express app
const app = express();
app.use(express.json());

// Routes
app.use('/api/business', businessRoutes);
app.use('/api/investor', investorRoutes);


// Server listener and DB connection
async function main() {
        try {
          await mongoose.connect(process.env.MONGO_URI);
          console.log("Connected to MongoDB");
      
          app.listen(3000, () => {
            console.log("Server is running on port 3000");
          });
      
        } catch (error) {
          console.error("Error connecting to MongoDB:", error);
        }
      }
    
      main();

