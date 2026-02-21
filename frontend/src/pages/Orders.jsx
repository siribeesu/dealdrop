import React, { useState, useEffect } from 'react'
import { Package, Truck, Calendar, ChevronRight, ShoppingBag, Loader2, ArrowLeft, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ordersAPI } from '../lib/api.js'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await ordersAPI.getOrders()
      if (response.success) {
        setOrders(response.orders || [])
      } else {
        setError(response.message || 'Failed to load orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { label: 'Pending', color: 'bg-amber-50 text-amber-600 border-amber-100' }
      case 'confirmed': return { label: 'Confirmed', color: 'bg-blue-50 text-blue-600 border-blue-100' }
      case 'processing': return { label: 'Processing', color: 'bg-purple-50 text-purple-600 border-purple-100' }
      case 'shipped': return { label: 'Shipped', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
      case 'delivered': return { label: 'Delivered', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
      case 'cancelled': return { label: 'Cancelled', color: 'bg-red-50 text-red-600 border-red-100' }
      default: return { label: status, color: 'bg-gray-50 text-gray-600 border-gray-100' }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="h-10 w-10 text-[#1E3A8A] animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Order History
            </h1>
            <nav className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Link to="/" className="hover:text-[#1E3A8A]">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#1F2937] font-semibold">My Orders</span>
            </nav>
          </div>
          <p className="text-sm font-bold text-[#6B7280]">
            Total Orders: <span className="text-[#1E3A8A]">{orders.length}</span>
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 text-center">
            <p className="text-lg font-bold mb-4">{error}</p>
            <button onClick={fetchOrders} className="btn-primary">Try Again</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm">
            <div className="h-20 w-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-6 text-[#9CA3AF]">
              <Package className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No orders found
            </h2>
            <p className="text-[#6B7280] max-w-sm mx-auto mb-8 font-medium">
              You haven't placed any orders yet. Start shopping and find something you love!
            </p>
            <Link to="/products">
              <button className="btn-primary">
                Browse Marketplace
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const status = getStatusInfo(order.orderStatus)
              return (
                <div key={order._id} className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden transition-all hover:shadow-md">
                  {/* Order Card Header */}
                  <div className="bg-[#F8FAFC] border-b border-[#E5E7EB] p-6 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Order Placed</p>
                        <p className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#6B7280]" /> {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-sm font-bold text-[#1E3A8A]">₹{order.total.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Order #</p>
                        <p className="text-sm font-bold text-[#1F2937]">{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${status.color}`}>
                      {status.label}
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Products List */}
                      <div className="space-y-6">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="h-20 w-20 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] overflow-hidden shrink-0">
                              <img src={item.image || '/placeholder-product.jpg'} className="h-full w-full object-contain p-2" alt="" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-[#1F2937] mb-1 truncate">{item.name}</h4>
                              <p className="text-xs font-semibold text-[#6B7280] mb-2">Qty: {item.quantity}</p>
                              <p className="text-sm font-bold text-[#1E3A8A]">₹{item.price.toFixed(0)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping & Actions */}
                      <div className="flex flex-col justify-between gap-8 py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Truck className="h-3 w-3" /> Shipping Address
                            </p>
                            <div className="text-sm text-[#6B7280] font-medium leading-relaxed">
                              <p className="text-[#1F2937] font-bold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3 flex items-center gap-2">
                              <ExternalLink className="h-3 w-3" /> Quick Actions
                            </p>
                            <div className="flex flex-col gap-2">
                              <button className="text-left py-2 px-4 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#1F2937] hover:bg-gray-50 transition-all">
                                View Order Details
                              </button>
                              <button className="text-left py-2 px-4 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#1F2937] hover:bg-gray-50 transition-all">
                                Download Invoice
                              </button>
                            </div>
                          </div>
                        </div>

                        {order.orderStatus === 'delivered' && (
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-emerald-700">Order Delivered Successfully</p>
                              <p className="text-[10px] text-emerald-600/80 font-medium">Thank you for shopping with DealDrop!</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
