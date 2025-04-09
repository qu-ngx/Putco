const Coupon = require('../../models/Coupon');
const { validateCouponRequest } = require('../middleware/validateCoupon');

exports.createCoupon = [
  validateCouponRequest,
  async (req, res) => {
    try {
      const { code, discountAmount, expiryDate } = req.body;
      
      const newCoupon = new Coupon({
        code,
        discountAmount,
        expiryDate,
        isActive: true
      });

      await newCoupon.save();
      
      res.status(201).json({
        success: true,
        data: newCoupon
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
];

exports.validateCoupon = [
  validateCouponRequest,
  async (req, res) => {
    try {
      const coupon = await Coupon.findOne({ 
        code: req.body.code,
        isActive: true,
        expiryDate: { $gt: new Date() }
      });

      if (!coupon) {
        return res.status(404).json({
          success: false,
          error: 'Invalid or expired coupon'
        });
      }

      res.status(200).json({
        success: true,
        data: coupon
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
];