import { createSlice } from '@reduxjs/toolkit'

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    appliedCoupon: null,
    discount: 0,
    loading: false,
    error: null
  },
  reducers: {
    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload
      state.discount = action.payload.discountAmount
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null
      state.discount = 0
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { applyCoupon, removeCoupon, setLoading, setError } = couponSlice.actions
export default couponSlice.reducer