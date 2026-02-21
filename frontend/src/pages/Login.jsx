import React, { useState } from 'react'
import { EyeOff, Eye, Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [canResend, setCanResend] = useState(false)
  const [resending, setResending] = useState(false)
  const { login, resendVerification } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await login(formData)
      if (response.success) {
        navigate('/')
      } else {
        setError(response.message || 'Login failed. Please try again.')
        if (response.message?.includes('verify')) {
          setCanResend(true)
        }
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setResending(true)
      const response = await resendVerification(formData.email)
      if (response.success) {
        setError('Verification email resent!')
        setCanResend(false)
      } else {
        setError(response.message || 'Failed to resend.')
      }
    } catch (err) {
      setError('An error occurred.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Left side: Branding/Visual (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 bg-[#1E3A8A] relative overflow-hidden items-center justify-center p-12 lg:p-20">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
        </div>
        <div className="relative z-10 max-w-lg text-center lg:text-left">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20 mb-8 shadow-2xl backdrop-blur-sm">
            <span className="text-white text-3xl font-black italic">D</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Elevate Your <br />
            <span className="text-[#F97316]">Shopping</span> Game
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Join thousands of smart shoppers and get access to exclusive deals, priority shipping, and modern retail experience.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <Feature icon={<ShieldCheck className="h-5 w-5" />} text="Secure Account" />
            <Feature icon={<ArrowRight className="h-5 w-5" />} text="Instant Access" />
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome Back
            </h2>
            <p className="text-[#6B7280] font-medium">Please enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className={`p-4 rounded-xl text-sm font-semibold flex flex-col gap-2 ${error.includes('resent') ? 'bg-green-50 text-[#16A34A] border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                <span>{error}</span>
                {canResend && (
                  <button type="button" onClick={handleResend} disabled={resending} className="text-xs uppercase tracking-widest font-bold underline hover:no-underline">
                    {resending ? 'Resending...' : 'Resend Verification'}
                  </button>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-[#1E3A8A] hover:text-[#2563EB]">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#1E3A8A] hover:bg-[#1e40af] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#6B7280] font-medium">
              Don't have an account? <Link to="/signup" className="text-[#F97316] font-bold border-b-2 border-transparent hover:border-[#F97316] transition-all">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Feature = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-white/80">
    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
      {icon}
    </div>
    <span className="text-sm font-semibold tracking-wide">{text}</span>
  </div>
)

export default Login
