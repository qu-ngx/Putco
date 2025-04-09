const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 5300;
const CLIENT_PORT = import.meta.env.VITE_CLIENT_PORT || 5173;
const CLIENT_PORT_ALT = import.meta.env.VITE_CLIENT_PORT_ALT || 5174;

export const API_BASE_URL = `http://localhost:${SERVER_PORT}/api`;

export const API_CONFIG = {
  baseURL: 'http://localhost:5300',
  endpoints: {
    health: '/api/health',
    customLocations: '/api/admin/newLocations',
    adminCustomLocations: '/api/admin/custom-locations'
  }
};

export const API_ENDPOINTS = {
  auth: {
    register: "http://localhost:5300/api/auth/register",
    login: "http://localhost:5300/api/auth/login",
    logout: "http://localhost:5300/api/auth/logout",
    checkAuth: "http://localhost:5300/api/auth/check-auth",
  },
  admin: {
    products: {
      upload: "http://localhost:5300/api/admin/products/upload-image",
      add: "http://localhost:5300/api/admin/products/add",
      edit: "http://localhost:5300/api/admin/products/edit",
      delete: "http://localhost:5300/api/admin/products/delete",
      get: "http://localhost:5300/api/admin/products/get",
    },
    orders: {
      get: "http://localhost:5300/api/admin/orders/get",
      details: "http://localhost:5300/api/admin/orders/details",
      update: "http://localhost:5300/api/admin/orders/update",
    },
    customLocations: {
      add: `${API_BASE_URL}/admin/custom-locations/add`,
      get: `${API_BASE_URL}/admin/custom-locations/get`,
      delete: (id) => `${API_BASE_URL}/admin/custom-locations/delete/${id}`
    },
  },
  shop: {
    products: {
      base: "http://localhost:5300/api/shop/products",
      details: (id) => `http://localhost:5300/api/shop/products/${id}`,
    },
    cart: {
      add: "http://localhost:5300/api/shop/cart/add",
      get: "http://localhost:5300/api/shop/cart/get",
      delete: "http://localhost:5300/api/shop/cart/delete",
      update: "http://localhost:5300/api/shop/cart/update",
    },
    address: {
      add: "http://localhost:5300/api/shop/address/add",
      get: "http://localhost:5300/api/shop/address/get",
      delete: "http://localhost:5300/api/shop/address/delete",
      update: "http://localhost:5300/api/shop/address/update",
    },
    order: {
      create: "http://localhost:5300/api/shop/order/create",
      list: "http://localhost:5300/api/shop/order/list",
      details: "http://localhost:5300/api/shop/order/details",
      capture: "http://localhost:5300/api/shop/order/capture",
    },
    review: {
      add: "http://localhost:5300/api/shop/review/add",
      get: "http://localhost:5300/api/shop/review",
    },
    search: (keyword) =>
      `http://localhost:5300/api/shop/products/search?keyword=${keyword}`,
    locations: {
      nearby: "http://localhost:5300/api/shop/locations/nearby",
      details: (id) => `http://localhost:5300/api/shop/locations/details/${id}`,
      search: "http://localhost:5300/api/shop/locations/search",
      favorites: "http://localhost:5300/api/shop/locations/favorites",
    },
    reviews: {
      add: `${API_BASE_URL}/shop/reviews`,
      get: (placeId) => `${API_BASE_URL}/shop/reviews/${placeId}`,
      delete: (reviewId) => `${API_BASE_URL}/shop/reviews/${reviewId}`,
      update: (reviewId) => `${API_BASE_URL}/shop/reviews/${reviewId}`,
    },

  },
  common: {
    feature: {
      add: "http://localhost:5300/api/common/feature/add",
      get: "http://localhost:5300/api/common/feature/get",
    },
  },
};

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';