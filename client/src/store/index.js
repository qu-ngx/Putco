import { configureStore } from '@reduxjs/toolkit'
import couponReducer from './slices/couponSlice'
import orderReducer from './slices/orderSlice'

export const store = configureStore({
  reducer: {
    coupon: couponReducer,
    orders: orderReducer
  }
})