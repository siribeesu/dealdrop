const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log("API_BASE_URL:", API_BASE_URL); 
// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { message: 'Failed to parse response' };
    }

    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong');
      error.data = data;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      console.error('Network or unknown error:', error);
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  verifyEmail: (token) => apiRequest(`/auth/verify/${token}`, {
    method: 'POST',
  }),

  resendVerification: (email) => apiRequest('/auth/public-resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  resetPassword: (token, password) => apiRequest(`/auth/reset-password/${token}`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),

  getCurrentUser: () => apiRequest('/auth/me'),

  updateProfile: (userData) => apiRequest('/auth/update-profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  changePassword: (passwordData) => apiRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }),

  getWishlist: () => apiRequest('/auth/wishlist'),

  addToWishlist: (productId) => apiRequest(`/auth/wishlist/${productId}`, {
    method: 'POST',
  }),

  removeFromWishlist: (productId) => apiRequest(`/auth/wishlist/${productId}`, {
    method: 'DELETE',
  }),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products?${queryString}`);
  },

  getProduct: (id) => apiRequest(`/products/${id}`),

  getFeaturedProducts: () => apiRequest('/products/featured'),

  getCategories: () => apiRequest('/products/categories'),

  createProduct: (productData) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),

  updateProduct: (id, productData) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),

  deleteProduct: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/products/upload-image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then(res => res.json());
  },

  uploadProductImage: (productId, formData) => apiRequest(`/products/${productId}/upload-image`, {
    method: 'POST',
    body: formData,
    headers: {}, // Let browser set content-type for FormData
  }),

  addProductReview: (productId, reviewData) => apiRequest(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
};

// Cart API
export const cartAPI = {
  getCart: () => apiRequest('/cart'),

  addToCart: (itemData) => apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),

  updateCartItem: (productId, quantity) => apiRequest(`/cart/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),

  removeFromCart: (productId) => apiRequest(`/cart/${productId}`, {
    method: 'DELETE',
  }),

  clearCart: () => apiRequest('/cart', {
    method: 'DELETE',
  }),

  mergeGuestCart: (guestCart) => apiRequest('/cart/merge', {
    method: 'POST',
    body: JSON.stringify({ guestCart }),
  }),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders?${queryString}`);
  },

  getOrder: (id) => apiRequest(`/orders/${id}`),

  cancelOrder: (id) => apiRequest(`/orders/${id}/cancel`, {
    method: 'PUT',
  }),
};

// Admin API
export const adminAPI = {
  login: (credentials) => apiRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getDashboardStats: () => apiRequest('/admin/dashboard'),

  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users?${queryString}`);
  },

  updateUser: (id, userData) => apiRequest(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  deleteUser: (id) => apiRequest(`/admin/users/${id}`, {
    method: 'DELETE',
  }),

  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/orders?${queryString}`);
  },

  updateOrder: (id, orderData) => apiRequest(`/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),

  createAdmin: (adminData) => apiRequest('/admin/create-admin', {
    method: 'POST',
    body: JSON.stringify(adminData),
  }),
};

// Health check
export const healthAPI = {
  check: () => apiRequest('/health'),
};

export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  admin: adminAPI,
  health: healthAPI,
};
