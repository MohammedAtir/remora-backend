const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const auth = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.post('/', auth, requireRole('business_owner'), businessController.createBusiness);
router.get('/', businessController.listBusinesses);
router.get('/:id', businessController.getBusiness);
router.put('/:id', auth, businessController.updateBusiness); // update requires auth & ownership check inside controller

module.exports = router;
