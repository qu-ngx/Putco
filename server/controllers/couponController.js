const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body
    
    // Add validation logic here
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' })
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ error: 'Coupon has expired' })
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' })
    }

    return res.json(coupon)
  } catch (error) {
    return res.status(500).json({ error: 'Server error' })
  }
}

const { createCoupon, listCoupons } = require('../services/couponService')

// Controller for creating a new coupon
const createCouponController = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      })
    }

    console.log('Creating coupon with data:', req.body)
    
    // Pass the user ID to the createCoupon function
    const coupon = await createCoupon(req.body, req.user._id)
    
    console.log('Coupon created:', coupon)
    
    res.status(201).json({
      success: true,
      data: coupon
    })
  } catch (error) {
    console.error('Error creating coupon:', error)
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Controller for listing all coupons
const listCouponsController = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      })
    }

    const coupons = await listCoupons()
    res.status(200).json({
      success: true,
      data: coupons
    })
  } catch (error) {
    console.error('Error listing coupons:', error)
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  validateCoupon,
  createCouponController,
  listCouponsController
}