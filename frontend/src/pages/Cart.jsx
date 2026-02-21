import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cartAPI } from '../lib/api'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const response = await cartAPI.getCart()
        if (response.success) {
          setCartItems(response.cart)
        }
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
    if (newQuantity === 0) {
      removeItem(productId)
      return
    }

    try {
      setUpdating(true)
      const response = await cartAPI.updateCartItem(productId, newQuantity)
      if (response.success) {
        setCartItems(response.cart)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  const removeItem = async (productId) => {
    try {
      setUpdating(true)
      const response = await cartAPI.removeFromCart(productId)
      if (response.success) {
        setCartItems(response.cart)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const savings = cartItems.reduce((sum, item) => {
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

  if (cartItems.length === 0) {
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
            Looks like you haven't added anything to your cart yet. Explore our latest products and find great deals!
          </p>
          <Link to="/products">
            <button className="btn-primary">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Shopping Cart
            </h1>
            <p className="text-sm font-medium text-[#6B7280]">
              You have {cartItems.length} items in your cart
            </p>
          </div>
          <Link to="/products" className="flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#2563EB] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E5E7EB] shadow-sm flex flex-col sm:flex-row items-center gap-6 group transition-all hover:shadow-md">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#F1F5F9] shrink-0">
                  <img
                    src={item.product.images?.[0]?.url || item.product.image || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="h-full w-full object-contain p-2"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <Link to={`/product/${item.product._id}`}>
                      <h3 className="text-lg font-bold text-[#1F2937] hover:text-[#1E3A8A] transition-colors truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {item.product.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      disabled={updating}
                      className="p-2 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase mb-4">{item.product.category}</p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden h-10 bg-[#F8FAFC]">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating}
                        className="w-10 h-full flex items-center justify-center hover:bg-white text-[#1F2937] disabled:opacity-30"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-[#1F2937]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={updating}
                        className="w-10 h-full flex items-center justify-center hover:bg-white text-[#1F2937]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-[#1F2937]">₹{(item.product.price * item.quantity).toFixed(0)}</p>
                      {item.product.originalPrice > item.product.price && (
                        <p className="text-xs text-[#9CA3AF] line-through">₹{(item.product.originalPrice * item.quantity).toFixed(0)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-[#1F2937] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
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

              {/* Trust Indicators */}
              <div className="space-y-4 pt-6 border-t border-[#F3F4F6]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#16A34A]" />
                  <span className="text-xs font-semibold text-[#6B7280]">Secure Payment Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-[#1E3A8A]" />
                  <span className="text-xs font-semibold text-[#6B7280]">Fast & Reliable Delivery</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="mt-6 p-4 bg-orange-50 rounded-xl text-[11px] font-bold text-[#F97316] text-center">
                  Add ₹{499 - subtotal} more for FREE shipping!
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
