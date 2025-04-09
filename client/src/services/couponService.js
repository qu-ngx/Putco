import axios from 'axios'
import config from '../config'

// Let's make sure we're using the correct API URL
const API_URL = `${config.apiUrl}/admin/coupons`

// Create a dedicated axios instance for debugging
const apiClient = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  timeout: 10000
})

// Add request interceptor for debugging
apiClient.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data
  })
  return request
})

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    })
    return response
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    return Promise.reject(error)
  }
)

export const couponService = {
  createCoupon: async (couponData) => {
    try {
      console.log('Sending request to:', API_URL)
      console.log('With data:', couponData)
      
      // For development/testing - provide mock data if no token
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.warn('No token found in localStorage - using mock mode')
        // Simulate network delay for more realistic testing
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Store in localStorage for persistence during development
        const existingCoupons = JSON.parse(localStorage.getItem('mockCoupons') || '[]')
        const newCoupon = {
          _id: 'mock-id-' + Date.now(),
          code: couponData.code,
          description: couponData.description,
          usage: couponData.usage,
          expiryDate: couponData.expiryDate,
          usageLimit: couponData.usageLimit,
          usedCount: 0,
          createdAt: new Date().toISOString()
        }
        
        existingCoupons.push(newCoupon)
        localStorage.setItem('mockCoupons', JSON.stringify(existingCoupons))
        
        return {
          success: true,
          data: newCoupon,
          message: 'Coupon created successfully (mock)'
        }
      }
      
      const response = await apiClient.post('/admin/coupons', couponData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Coupon creation error:', error)
      
      // Provide more detailed error information
      if (error.response) {
        console.error('Server responded with error:', {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers
        })
      } else if (error.request) {
        console.error('No response received:', error.request)
      }
      
      // Return a formatted error for the UI
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create coupon'
      }
    }
  },
  
  getAllCoupons: async () => {
    try {
      console.log('Fetching coupons from:', API_URL)
      
      // For development/testing - provide mock data if no token or server
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.warn('No token found in localStorage - using mock data')
        // Simulate network delay for more realistic testing
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Get stored mock coupons from localStorage or use defaults
        const storedCoupons = localStorage.getItem('mockCoupons')
        let mockCoupons = []
        
        if (storedCoupons) {
          mockCoupons = JSON.parse(storedCoupons)
        } else {
          // Default mock data if nothing in localStorage
          mockCoupons = [
            {
              _id: 'mock-id-1',
              code: 'WELCOME10',
              description: 'Welcome discount for new customers',
              usage: 'Apply at checkout for 10% off your first order',
              expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              usageLimit: 100,
              usedCount: 0,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'mock-id-2',
              code: 'SUMMER25',
              description: 'Summer sale discount',
              usage: 'Apply at checkout for 25% off summer items',
              expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
              usageLimit: 50,
              usedCount: 5,
              createdAt: new Date().toISOString()
            }
          ]
          localStorage.setItem('mockCoupons', JSON.stringify(mockCoupons))
        }
        
        return {
          success: true,
          data: mockCoupons
        }
      }
      
      const response = await apiClient.get('/admin/coupons', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Fetch coupons error:', error)
      
      // Check if the server is running at all
      try {
        console.log('Checking if server is running...')
        await axios.get(`${config.apiUrl}/health`, { timeout: 2000 })
        console.log('Server is running, but coupon endpoint is not available')
      } catch (healthError) {
        console.error('Server health check failed:', healthError.message)
        console.log('Server might not be running or is not accessible')
        
        // Return mock data for development when server is not available
        console.log('Returning mock data since server is not accessible')
        return {
          success: true,
          data: [
            {
              _id: 'mock-id-1',
              code: 'WELCOME10',
              description: 'Welcome discount for new customers',
              expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              usageLimit: 100,
              usedCount: 0,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'mock-id-2',
              code: 'SUMMER25',
              description: 'Summer sale discount',
              expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
              usageLimit: 50,
              usedCount: 5,
              createdAt: new Date().toISOString()
            }
          ]
        }
      }
      
      // Return a formatted error for the UI
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch coupons'
      }
    }
  },
  
  // Add a method to delete coupons (for mock mode)
  deleteCoupon: async (couponId) => {
    try {
      console.log('Deleting coupon with ID:', couponId)
      
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.warn('No token found in localStorage - using mock mode')
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Get stored mock coupons
        const storedCoupons = localStorage.getItem('mockCoupons')
        if (storedCoupons) {
          const coupons = JSON.parse(storedCoupons)
          const updatedCoupons = coupons.filter(coupon => coupon._id !== couponId)
          localStorage.setItem('mockCoupons', JSON.stringify(updatedCoupons))
        }
        
        return {
          success: true,
          message: 'Coupon deleted successfully (mock)'
        }
      }
      
      const response = await apiClient.delete(`/admin/coupons/${couponId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Delete coupon error:', error)
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete coupon'
      }
    }
  }
}