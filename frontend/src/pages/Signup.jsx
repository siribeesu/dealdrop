import React, { useState } from 'react'
import { EyeOff, Eye, User, Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await register(formData)
      if (response.success) {
        setSuccess(response.message || 'Account created! Please verify your email.')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(response.message || 'Signup failed. Please check your information.')
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError(error.data?.message || error.message || 'Internal server error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Visual side */}
      <div className="hidden md:flex flex-1 bg-[#1E3A8A] relative overflow-hidden items-center justify-center p-12 lg:p-20">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
        </div>
        <div className="relative z-10 max-w-lg text-center lg:text-left text-white">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20 mb-8 shadow-2xl backdrop-blur-sm">
            <span className="text-white text-3xl font-black italic">D</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Start Your <br />
            <span className="text-[#F97316]">Shopping</span> Journey
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Create an account to unlock personalized recommendations, easy tracking, and faster checkout experience.
          </p>
          <div className="space-y-4">
            <Feature icon={<ShieldCheck className="h-4 w-4" />} text="Verified Authentic Products" />
            <Feature icon={<ArrowRight className="h-4 w-4" />} text="Exclusive Member Rewards" />
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Create Account
            </h2>
            <p className="text-[#6B7280] font-medium">Join DealDrop today and shop the best brands</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            {error && <div className="p-4 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold">{error}</div>}
            {success && <div className="p-4 bg-green-50 text-[#16A34A] border border-green-100 rounded-xl text-sm font-semibold">{success}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-11 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#1E3A8A] hover:bg-[#1e40af] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#6B7280] font-medium">
              Already have an account? <Link to="/login" className="text-[#F97316] font-bold border-b-2 border-transparent hover:border-[#F97316] transition-all">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Feature = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
      {icon}
    </div>
    <span className="text-sm font-semibold tracking-wide">{text}</span>
  </div>
)

export default Signup