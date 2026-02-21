import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../lib/api.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await authAPI.getCurrentUser()
        if (response.success) {
          setUser(response.user)
          setWishlist(response.user.wishlist || [])
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      if (response.success) {
        localStorage.setItem('token', response.token)
        setUser(response.user)
        setWishlist(response.user.wishlist || [])
        setIsAuthenticated(true)
        return { success: true, user: response.user }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.data?.message || 'Login failed. Please try again.' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      return response
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData)
      if (response.success) {
        setUser(response.user)
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: 'Profile update failed. Please try again.' }
    }
  }

  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData)
      return response
    } catch (error) {
      return { success: false, message: 'Password change failed. Please try again.' }
    }
  }

  const addToWishlist = async (productId) => {
    try {
      const response = await authAPI.addToWishlist(productId)
      if (response.success) {
        setWishlist(response.wishlist)
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: 'Failed to add to wishlist' }
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      const response = await authAPI.removeFromWishlist(productId)
      if (response.success) {
        setWishlist(response.wishlist)
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: 'Failed to remove from wishlist' }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    wishlist,
    login,
    register,
    resendVerification: authAPI.resendVerification,
    logout,
    updateProfile,
    changePassword,
    addToWishlist,
    removeFromWishlist,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
