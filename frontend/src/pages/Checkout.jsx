import React, { useState, useEffect } from 'react'
import { Truck, CreditCard, ShieldCheck, Loader2, ArrowLeft, ChevronRight, Lock, MapPin, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { cartAPI, ordersAPI } from '../lib/api'

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const response = await cartAPI.getCart()
        if (response.success) {
          setCartItems(response.cart)
          if (response.cart.length === 0) {
            navigate('/cart')
          }
        }
      } catch (error) {
        setError('Failed to load checkout details.')
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const orderData = {
        shippingAddress: formData,
        paymentMethod: paymentMethod
      }
      const response = await ordersAPI.createOrder(orderData)
      if (response.success) {
        navigate('/orders')
      } else {
        setError(response.message || 'Failed to place order.')
      }
    } catch (error) {
      setError('Internal server error.')
    } finally {
      setSubmitting(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = subtotal > 499 ? 0 : 40
  const total = subtotal + shipping

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="h-10 w-10 text-[#1E3A8A] animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation / Progress */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-10">
          <Link to="/cart" className="hover:text-[#1E3A8A] flex items-center gap-1.5 transition-colors">
            <span className="h-5 w-5 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[10px] font-bold">1</span> Cart
          </Link>
          <ChevronRight className="h-3 w-3 text-[#E5E7EB]" />
          <span className="flex items-center gap-1.5 text-[#1F2937] font-bold">
            <span className="h-5 w-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[10px] font-bold">2</span> Checkout
          </span>
          <ChevronRight className="h-3 w-3 text-[#E5E7EB]" />
          <span className="flex items-center gap-1.5 text-[#9CA3AF]">
            <span className="h-5 w-5 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[10px] font-bold">3</span> Confirmation
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-[#1F2937] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Shipping Details
            </h1>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm">
                <h3 className="text-lg font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-4 mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#1E3A8A]" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                  <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                  <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                  <FormInput label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm">
                <h3 className="text-lg font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-4 mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#1E3A8A]" /> Delivery Address
                </h3>
                <div className="space-y-6">
                  <FormInput label="Street Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Building 123, Main Street" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput label="City" name="city" value={formData.city} onChange={handleInputChange} placeholder="Mumbai" />
                    <FormInput label="State" name="state" value={formData.state} onChange={handleInputChange} placeholder="Maharashtra" />
                    <FormInput label="ZIP Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="400001" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm">
                <h3 className="text-lg font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-4 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#1E3A8A]" /> Payment Method
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PaymentCard
                    id="card"
                    title="Credit/Debit Card"
                    selected={paymentMethod === 'card'}
                    onClick={() => setPaymentMethod('card')}
                    icon={<CreditCard className="h-5 w-5" />}
                  />
                  <PaymentCard
                    id="upi"
                    title="UPI / PhonePe"
                    selected={paymentMethod === 'upi'}
                    onClick={() => setPaymentMethod('upi')}
                    icon={<Search className="h-5 w-5" />}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar: Order Overview */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E3A8A] rounded-3xl p-8 text-white shadow-xl sticky top-24 overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="flex justify-between items-start gap-4">
                      <div className="flex gap-3">
                        <div className="h-12 w-12 bg-white/10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <img src={item.product.images?.[0]?.url || item.product.image} className="h-full w-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="text-xs font-bold line-clamp-1">{item.product.name}</p>
                          <p className="text-[10px] text-white/60 font-medium uppercase mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10 mb-8">
                  <div className="flex justify-between text-sm font-medium text-white/70">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-white/70">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-[#16A34A] font-bold' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="pt-4 flex justify-between items-center text-white">
                    <span className="text-lg font-bold">Total Pay</span>
                    <span className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ₹{total.toFixed(0)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="w-full h-14 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-black/20"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                  {submitting ? 'Processing...' : 'Complete Payment'}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <ShieldCheck className="h-4 w-4" /> Secure 256-bit SSL Encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Helper Components */
const FormInput = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all"
    />
  </div>
)

const PaymentCard = ({ id, title, selected, onClick, icon }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selected
        ? 'border-[#1E3A8A] bg-blue-50/50'
        : 'border-[#E5E7EB] hover:border-[#1F2937]'
      }`}
  >
    <div className="flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${selected ? 'bg-[#1E3A8A] text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
        {icon}
      </div>
      <span className={`text-sm font-bold ${selected ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>{title}</span>
    </div>
    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#1E3A8A] bg-[#1E3A8A]' : 'border-[#E5E7EB]'}`}>
      {selected && <div className="h-2 w-2 rounded-full bg-white"></div>}
    </div>
  </div>
)

export default Checkout
