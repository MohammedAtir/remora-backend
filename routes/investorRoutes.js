// routes/investorRoutes.js
const express = require('express');
const router = express.Router();
const investorController = require('../controllers/investorControllers');

router.post('/', investorController.createInvestor);

module.exports = router;
