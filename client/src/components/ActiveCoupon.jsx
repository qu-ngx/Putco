import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeCoupon } from '../store/slices/couponSlice'

const ActiveCoupon = () => {
  const dispatch = useDispatch()
  const { appliedCoupon, discount } = useSelector(state => state.coupon)

  if (!appliedCoupon) return null

  return (
    <div className="flex items-center justify-between p-4 bg-green-50 rounded-md">
      <div>
        <p className="text-sm font-medium text-green-800">
          Applied Coupon: {appliedCoupon.code}
        </p>
        <p className="text-sm text-green-600">
          Discount: ${discount.toFixed(2)}
        </p>
      </div>
      <button
        onClick={() => dispatch(removeCoupon())}
        className="text-sm text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </div>
  )
}

export default ActiveCoupon