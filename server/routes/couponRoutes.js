const express = require('express')
const router = express.Router()
const { validateCouponCode, trackCouponUsage } = require('../services/couponService')

router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body
    const coupon = await validateCouponCode(code)
    res.json(coupon)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/track', async (req, res) => {
  try {
    const { code } = req.body
    const coupon = await trackCouponUsage(code)
    res.json(coupon)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router