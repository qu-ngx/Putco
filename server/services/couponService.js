const Coupon = require('../models/Coupon')

const createCoupon = async (couponData, userId) => {
  try {
    const coupon = new Coupon({
      ...couponData,
      code: couponData.code.toUpperCase(),
      description: couponData.description,
      usage: couponData.usage,
      createdBy: userId
    })
    await coupon.save()
    return coupon
  } catch (error) {
    console.error('Coupon creation error:', error)
    throw new Error('Failed to create coupon')
  }
}

const listCoupons = async () => {
  try {
    return await Coupon.find().sort({ createdAt: -1 })
  } catch (error) {
    console.error('Coupon listing error:', error)
    throw new Error('Failed to fetch coupons')
  }
}

const validateCouponCode = async (code) => {
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() })

    if (!coupon) {
      throw new Error('Invalid coupon code')
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      throw new Error('Coupon has expired')
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit reached')
    }

    return coupon
  } catch (error) {
    console.error('Coupon validation error:', error)
    throw error
  }
}

const trackCouponUsage = async (couponCode) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      { code: couponCode },
      { $inc: { usedCount: 1 } },
      { new: true }
    )
    return coupon
  } catch (error) {
    console.error('Coupon tracking error:', error)
    throw new Error('Failed to track coupon usage')
  }
}

module.exports = {
  createCoupon,
  listCoupons,
  validateCouponCode,
  trackCouponUsage
}