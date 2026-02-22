import React, { useState, useEffect } from 'react'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cartAPI } from '../lib/api.js'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null) // productId of item being updated
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const response = await cartAPI.getCart()
        if (response.success) setCartItems(response.cart)
      } catch (error) {
        setError('Failed to load cart.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity === 0) { removeItem(productId); return }
    try {
      setUpdating(productId)
      const response = await cartAPI.updateCartItem(productId, newQuantity)
      if (response.success) setCartItems(response.cart)
    } catch (error) {
      console.error(error)
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (productId) => {
    try {
      setUpdating(productId)
      const response = await cartAPI.removeFromCart(productId)
      if (response.success) setCartItems(response.cart)
    } catch (error) {
      console.error(error)
    } finally {
      setUpdating(null)
    }
  }

  const validCartItems = cartItems.filter(item => item.product !== null)
  const subtotal = validCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const savings = validCartItems.reduce((sum, item) => {
    const original = item.product.originalPrice || item.product.price
    return sum + ((original - item.product.price) * item.quantity)
  }, 0)
  const shipping = subtotal > 499 ? 0 : 40
  const total = subtotal + shipping

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="h-10 w-10 text-[#1E3A8A] animate-spin" />
    </div>
  )

  if (validCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#E5E7EB]">
            <ShoppingBag className="w-10 h-10 text-[#9CA3AF]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Your Cart is Empty
          </h1>
          <p className="text-[#6B7280] mb-8 max-w-sm mx-auto">
            Looks like you haven't added anything yet. Explore our latest deals!
          </p>
          <Link to="/products">
            <button className="px-8 py-3 bg-[#1E3A8A] text-white rounded-xl font-bold hover:bg-blue-800 transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Shopping Cart
            </h1>
            <p className="text-sm font-medium text-[#6B7280] mt-1">
              {validCartItems.length} item{validCartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Link to="/products" className="flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#2563EB] transition-colors self-start sm:self-auto">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {validCartItems.map((item) => {
              const isUpdating = updating === item.product._id
              return (
                <div
                  key={item.product._id}
                  className={`bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm transition-all hover:shadow-md ${isUpdating ? 'opacity-60' : ''}`}
                >
                  <div className="flex gap-3 sm:gap-5">
                    {/* Product Image */}
                    <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#F1F5F9] shrink-0">
                      <img
                        src={item.product.images?.[0]?.url || item.product.image || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <Link to={`/product/${item.product._id}`}>
                            <h3
                              className="text-sm sm:text-base font-bold text-[#1F2937] hover:text-[#1E3A8A] transition-colors leading-tight line-clamp-2"
                              style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-xs font-semibold text-[#9CA3AF] uppercase mt-1 truncate">
                            {item.product.category}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeItem(item.product._id)}
                          disabled={!!updating}
                          className="shrink-0 p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-all border border-red-100"
                          title="Remove item"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Quantity + Price */}
                      <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden h-9 bg-[#F8FAFC]">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || !!updating}
                            className="w-9 h-full flex items-center justify-center hover:bg-white text-[#1F2937] disabled:opacity-30 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-9 text-center font-bold text-sm text-[#1F2937]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            disabled={!!updating}
                            className="w-9 h-full flex items-center justify-center hover:bg-white text-[#1F2937] transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0">
                          <p className="text-base sm:text-lg font-bold text-[#1F2937]">
                            ₹{(item.product.price * item.quantity).toFixed(0)}
                          </p>
                          {item.product.originalPrice > item.product.price && (
                            <p className="text-xs text-[#9CA3AF] line-through">
                              ₹{(item.product.originalPrice * item.quantity).toFixed(0)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-[#1F2937] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#6B7280]">Subtotal</span>
                  <span className="text-sm font-bold text-[#1F2937]">₹{subtotal.toFixed(0)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#6B7280]">Total Savings</span>
                    <span className="text-sm font-bold text-[#16A34A]">-₹{savings.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#6B7280]">Shipping</span>
                  <span className={`text-sm font-bold ${shipping === 0 ? 'text-[#16A34A]' : 'text-[#1F2937]'}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] flex justify-between items-center">
                  <span className="text-lg font-bold text-[#1F2937]">Grand Total</span>
                  <span className="text-2xl font-bold text-[#1E3A8A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    ₹{total.toFixed(0)}
                  </span>
                </div>
              </div>

              <Link to="/checkout">
                <button className="w-full h-14 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/10 transition-all active:scale-[0.98] mb-6 flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </button>
              </Link>

              <div className="space-y-3 pt-5 border-t border-[#F3F4F6]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#16A34A] shrink-0" />
                  <span className="text-xs font-semibold text-[#6B7280]">Secure Payment Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-[#1E3A8A] shrink-0" />
                  <span className="text-xs font-semibold text-[#6B7280]">Fast & Reliable Delivery</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="mt-5 p-3 bg-orange-50 rounded-xl text-[11px] font-bold text-[#F97316] text-center border border-orange-100">
                  🎉 Add ₹{(499 - subtotal).toFixed(0)} more for FREE shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
