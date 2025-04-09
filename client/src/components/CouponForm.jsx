import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyCoupon, setError, setLoading } from '../store/slices/couponSlice'
import { couponService } from '../services/couponService'

const CouponForm = () => {
  const [code, setCode] = useState('')
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.coupon)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const couponData = await couponService.validateCoupon(code)
      dispatch(applyCoupon(couponData))
      setCode('')
    } catch (err) {
      dispatch(setError(err))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="coupon" className="block text-sm font-medium">
            Discount Code
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="coupon"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter discount code"
            />
            <button
              type="submit"
              disabled={loading || !code}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </form>
    </div>
  )
}

export default CouponForm