const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, transactionController.createTransaction);

module.exports = router;
