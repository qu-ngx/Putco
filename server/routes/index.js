const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const shopRoutes = require('./shop');
const authRoutes = require('./auth');

// Register routes with their respective prefixes
router.use('/admin', adminRoutes);
router.use('/shop', shopRoutes);
router.use('/auth', authRoutes);

module.exports = router;