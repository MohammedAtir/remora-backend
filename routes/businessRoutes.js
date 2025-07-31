const express = require('express');
const router = express.Router();

// Example route (temporary, for testing)
router.get('/', (req, res) => {
  res.send('Business route working!');
});

module.exports = router;
