// server.js
const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
    return server;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
    throw err;
  }
}

// Only start the server if the file is run directly (not imported by a test).
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };