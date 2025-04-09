import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([])
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountAmount: 0,
    expiryDate: '',
    usageLimit: 0
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('/api/admin/coupons')
      setCoupons(response.data)
    } catch (error) {
      console.error('Error fetching coupons:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/admin/coupons', newCoupon)
      fetchCoupons()
      setNewCoupon({
        code: '',
        discountAmount: 0,
        expiryDate: '',
        usageLimit: 0
      })
    } catch (error) {
      console.error('Error creating coupon:', error)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Coupon Management</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium">Code</label>
          <input
            type="text"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Discount Amount</label>
          <input
            type="number"
            value={newCoupon.discountAmount}
            onChange={(e) => setNewCoupon({...newCoupon, discountAmount: parseFloat(e.target.value)})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Expiry Date</label>
          <input
            type="date"
            value={newCoupon.expiryDate}
            onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Usage Limit</label>
          <input
            type="number"
            value={newCoupon.usageLimit}
            onChange={(e) => setNewCoupon({...newCoupon, usageLimit: parseInt(e.target.value)})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Coupon
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">${coupon.discountAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coupon.usedCount} / {coupon.usageLimit || '∞'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CouponManagement