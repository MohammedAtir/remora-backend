const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');

// Validation rules for creating/updating a business
const validateBusiness = [
  body('name').trim().notEmpty().withMessage('name required'),
  body('financials.revenue')
    .optional()
    .isNumeric()
    .withMessage('revenue must be numeric'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Routes
router.post(
  '/',
  authMiddleware,
  requireRole('business_owner'),
  validateBusiness,
  asyncHandler(businessController.createBusiness)
);

router.get('/', asyncHandler(businessController.listBusinesses));
router.get('/:id', asyncHandler(businessController.getBusiness));

router.put(
  '/:id',
  authMiddleware,
  validateBusiness,
  asyncHandler(businessController.updateBusiness)
);

module.exports = router;
