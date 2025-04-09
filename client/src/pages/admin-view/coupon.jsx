import React, { useState, useEffect } from 'react'
import { couponService } from '../../services/couponService'

const CouponPage = () => {
  const [coupons, setCoupons] = useState([])
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountAmount: 0,
    expiryDate: '',
    usageLimit: 0
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const response = await couponService.listCoupons()
      if (response.success) {
        setCoupons(response.data)
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch coupons')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const response = await couponService.createCoupon(newCoupon)
      if (response.success) {
        fetchCoupons()
        setNewCoupon({
          code: '',
          discountAmount: 0,
          expiryDate: '',
          usageLimit: 0
        })
      }
    } catch (error) {
      setError(error.message || 'Failed to create coupon')
    } finally {
      setLoading(false)
    }
  }

  // ... rest of your component code ...
}

export default CouponPage