import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CouponPage = () => {
  const [coupons, setCoupons] = useState([])
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountAmount: 0,
    expiryDate: '',
    usageLimit: 0
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('/api/admin/coupons')
      if (response.data.success) {
        setCoupons(response.data.data)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch coupons')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/admin/coupons', newCoupon)
      if (response.data.success) {
        fetchCoupons()
        setNewCoupon({
          code: '',
          discountAmount: 0,
          expiryDate: '',
          usageLimit: 0
        })
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create coupon')
    }
  }

  const handleDelete = async (code) => {
    try {
      const response = await axios.delete(`/api/admin/coupons/${code}`)
      if (response.data.success) {
        fetchCoupons()
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete coupon')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Coupon Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <input
            type="text"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Discount Amount</label>
          <input
            type="number"
            value={newCoupon.discountAmount}
            onChange={(e) => setNewCoupon({...newCoupon, discountAmount: parseFloat(e.target.value)})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input
            type="date"
            value={newCoupon.expiryDate}
            onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Usage Limit</label>
          <input
            type="number"
            value={newCoupon.usageLimit}
            onChange={(e) => setNewCoupon({...newCoupon, usageLimit: parseInt(e.target.value)})}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td className="px-6 py-4">{coupon.code}</td>
                <td className="px-6 py-4">${coupon.discountAmount}</td>
                <td className="px-6 py-4">
                  {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}
                </td>
                <td className="px-6 py-4">
                  {coupon.usedCount} / {coupon.usageLimit || '∞'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(coupon.code)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CouponPage