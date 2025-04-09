import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { couponService } from '../../services/couponService'

const CouponPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      code: '',
      description: '',
      usage: '',
      expiryDate: '',
      usageLimit: ''
    }
  });

  useEffect(() => {
    console.log('CouponPage component rendered with updated fields');
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setFetchLoading(true);
      const response = await couponService.getAllCoupons();
      if (response.success) {
        setCoupons(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const couponData = {
        code: data.code.trim(),
        description: data.description.trim(),
        usage: data.usage.trim(),
        expiryDate: data.expiryDate,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : 0
      };

      console.log('Submitting coupon data:', couponData);

      const response = await couponService.createCoupon(couponData);

      if (response.success) {
        reset();
        setSuccessMessage('Coupon created successfully!');
        setTimeout(() => setSuccessMessage(null), 5000);
        fetchCoupons(); // Refresh the coupon list
      } else {
        setError(response.message || 'Failed to create coupon');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      setDeleteLoading(couponId);
      setError(null);

      const response = await couponService.deleteCoupon(couponId);

      if (response.success) {
        setSuccessMessage('Coupon deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 5000);
        // Refresh the coupon list
        fetchCoupons();
      } else {
        setError(response.message || 'Failed to delete coupon');
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
      setError(err.message || 'Failed to delete coupon');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Coupon Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        {/* Form fields for coupon creation */}
        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <input
            type="text"
            className={`w-full p-2 border rounded ${errors.code ? 'border-red-500' : ''}`}
            placeholder="Enter coupon code"
            {...register('code', { required: 'Coupon code is required' })}
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Enter coupon description"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Usage Instructions</label>
          <textarea
            className={`w-full p-2 border rounded ${errors.usage ? 'border-red-500' : ''}`}
            placeholder="Enter usage instructions"
            rows="3"
            {...register('usage', { required: 'Usage instructions are required' })}
          />
          {errors.usage && (
            <p className="text-red-500 text-sm mt-1">{errors.usage.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input
            type="date"
            className={`w-full p-2 border rounded ${errors.expiryDate ? 'border-red-500' : ''}`}
            {...register('expiryDate', { required: 'Expiry date is required' })}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Usage Limit</label>
          <input
            type="text"
            className={`w-full p-2 border rounded ${errors.usageLimit ? 'border-red-500' : ''}`}
            placeholder="Enter a whole number (e.g. 5)"
            {...register('usageLimit', {
              pattern: {
                value: /^[0-9]+$/,
                message: 'Please enter a valid whole number'
              }
            })}
          />
          {errors.usageLimit && (
            <p className="text-red-500 text-sm mt-1">{errors.usageLimit.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
      </form>

      {/* Display existing coupons */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Coupons</h2>

        {fetchLoading ? (
          <p>Loading coupons...</p>
        ) : coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Code</th>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">Expiry Date</th>
                  <th className="py-2 px-4 border">Usage Limit</th>
                  <th className="py-2 px-4 border">Actions</th> {/* New column for actions */}
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b">
                    <td className="py-2 px-4 border">{coupon.code}</td>
                    <td className="py-2 px-4 border">{coupon.description}</td>
                    <td className="py-2 px-4 border">
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border">{coupon.usageLimit || 'Unlimited'}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        disabled={deleteLoading === coupon._id}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:bg-red-300"
                      >
                        {deleteLoading === coupon._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No coupons found.</p>
        )}
      </div>
    </div>
  );
};

export default CouponPage;