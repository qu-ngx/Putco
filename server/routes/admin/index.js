const express = require('express');
const router = express.Router();
const couponRoutes = require('./coupon-routes');
// Import custom locations routes
const customLocationsRoutes = require('./custom-locations-routes');

// Register coupon routes
router.use('/coupons', couponRoutes);

// Register custom locations routes
router.use('/newLocations', customLocationsRoutes);

module.exports = router;