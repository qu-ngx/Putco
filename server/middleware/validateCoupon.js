const validateCouponRequest = (req, res, next) => {
  const { code } = req.body

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      error: 'Invalid coupon code format'
    })
  }

  if (code.length < 3 || code.length > 20) {
    return res.status(400).json({
      error: 'Coupon code must be between 3 and 20 characters'
    })
  }

  req.body.code = code.toUpperCase()
  next()
}

module.exports = {
  validateCouponRequest
}