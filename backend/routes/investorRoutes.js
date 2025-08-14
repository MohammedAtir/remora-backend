const express = require('express');
const router = express.Router();
const investorController = require('../controllers/investorControllers');
const auth = require('../middlewares/authMiddleware');

router.post('/', investorController.createInvestor);
router.get('/', investorController.listInvestors);
router.get('/portfolio', auth, investorController.getPortfolio);

module.exports = router;
