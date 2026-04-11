import React, { useState } from 'react'
import { EyeOff, Eye, Mail, Lock, ArrowRight, ShieldCheck, Loader2, ArrowLeft, Smartphone, Key } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
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
  const { login, resendVerification, logout, googleLogin } = useAuth()
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
      const identifier = formData.email
      const loginData = { password: formData.password }
      
      // Basic detection logic
      if (identifier.includes('@')) {
        loginData.email = identifier
      } else {
        loginData.phoneNumber = identifier
      }

      const response = await login(loginData)
      if (response.success) {
        if (response.user.role === 'admin') {
          logout()
          setError('Admins cannot log in here. Please use the Admin portal.')
        } else {
          navigate('/')
        }
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    try {
      const res = await googleLogin(credentialResponse.credential)
      if (res.success) navigate('/')
      else setError(res.message)
    } catch (err) {
      setError('Google login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setResending(true)
      const identifier = formData.email
      const resendData = identifier.includes('@') ? { email: identifier } : { phoneNumber: identifier }
      
      const response = await resendVerification(resendData)
      if (response.success) {
        setError('Verification code resent!')
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
        <div 
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        ></div>
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
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 text-[#6B7280] hover:text-[#1E3A8A] transition-colors font-bold text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome Back
            </h2>
            <p className="text-[#6B7280] font-medium">Log in with your credentials or social account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                <p className="text-red-700 text-sm font-bold flex items-center gap-2">
                  {error}
                  {canResend && (
                    <button 
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="underline hover:text-red-800 ml-2"
                    >
                      {resending ? 'Sending...' : 'Resend Verification?'}
                    </button>
                  )}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest ml-1">Email or Phone Number</label>
              <div className="relative group">
                <input
                  type="text"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@email.com or +91..."
                  className="w-full h-14 pl-4 pr-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#1E3A8A] focus:ring-4 focus:ring-[#1E3A8A]/5 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" title="reset password" className="text-xs font-bold text-[#F97316] hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF] group-focus-within:text-[#1E3A8A] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#1E3A8A] focus:ring-4 focus:ring-[#1E3A8A]/5 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF] hover:text-[#1E3A8A] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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

          <div className="space-y-6 mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest text-[10px]">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                useOneTap
                theme="outline"
                shape="circle"
                text="signin_with"
                width="100%"
              />
            </div>
          </div>

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
