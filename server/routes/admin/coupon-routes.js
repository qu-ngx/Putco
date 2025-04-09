const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/admin/coupon-controller');

// POST /api/admin/coupons - Create new coupon
router.post('/', couponController.createCoupon);

// POST /api/admin/coupons/validate - Validate coupon
router.post('/validate', couponController.validateCoupon);

module.exports = router;