import React, { useState } from 'react'
import { EyeOff, Eye, User, Lock, ArrowRight, ShieldCheck, Loader2, ArrowLeft, Smartphone, Key } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext.jsx'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '', // used for both email and phone input
    password: '',
    otp: ''
  })
  const { register, googleLogin, registerVerify, sendOTP } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const identifier = formData.email
    const isEmail = identifier.includes('@')

    try {
      if (otpSent) {
        // STEP 2: Verify OTP and Create Account
        const signupPayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          otp: formData.otp
        }

        if (isEmail) signupPayload.email = identifier
        else signupPayload.phoneNumber = identifier

        const res = await registerVerify(signupPayload)
        if (res.success) {
          setSuccess('Account created successfully! Welcome to DealDrop.')
          setTimeout(() => navigate('/'), 1500)
        } else {
          setError(res.message)
        }
      } else {
        // STEP 1: Request Registration OTP
        if (!identifier) {
          setError('Please provide either an email address or a phone number.')
          setLoading(false)
          return
        }
        
        const identity = isEmail ? { email: identifier } : { phoneNumber: identifier }
        const response = await register(identity)
        
        if (response.success) {
          setSuccess(response.message)
          setOtpSent(true)
        } else {
          setError(response.message || 'Signup failed.')
        }
      }
    } catch (err) {
      console.error('Signup Error:', err)
      setError(err.data?.message || err.message || 'Server error occurred.')
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
      setError('Google signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setSuccess('')
    setError('')
    try {
      const isEmail = formData.email.includes('@')
      const identity = isEmail ? { email: formData.email } : { phoneNumber: formData.email }
      const res = await register(identity) // Re-use register step 1
      if (res.success) setSuccess('New verification code sent!')
      else setError(res.message)
    } catch (err) {
      setError('Failed to resend code.')
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
            Join the <br />
            <span className="text-[#F97316]">DealDrop</span> Hub
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Create an account to unlock personalized recommendations, easy tracking, and faster checkout experience.
          </p>
          <div className="grid grid-cols-2 gap-6 text-white/80">
            <Feature icon={<ShieldCheck className="h-5 w-5" />} text="Secure Account" />
            <Feature icon={<Smartphone className="h-5 w-5" />} text="Cross Platform" />
          </div>
        </div>
      </div>

      {/* Form side */}
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
              Create Account
            </h2>
            <p className="text-[#6B7280] font-medium">Join DealDrop today in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-4 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold">{error}</div>}
            {success && <div className="p-4 bg-green-50 text-[#16A34A] border border-green-100 rounded-xl text-sm font-semibold">{success}</div>}

            {!otpSent ? (
              <div className="space-y-4">
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
                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none"
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
                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">Email or Phone Number</label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@email.com or +91..."
                      className="w-full h-12 pl-4 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none"
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
                      className="w-full h-12 pl-11 pr-11 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none"
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
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1.5 text-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">Verification Code</label>
                  <p className="text-[11px] text-[#6B7280]">Sent to {formData.email}</p>
                  <div className="relative mt-4">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="6-digit code"
                      maxLength="6"
                      className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold tracking-[0.5em] text-center focus:ring-2 focus:ring-[#1E3A8A]/10 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-[#1E3A8A] hover:bg-[#1e40af] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Finish'}
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleResend}
                    className="w-full h-12 bg-white text-[#1E3A8A] border border-[#E5E7EB] hover:bg-gray-50 rounded-xl font-bold text-sm transition-all flex items-center justify-center"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false)
                    setError('')
                    setSuccess('')
                  }}
                  className="w-full text-xs font-bold text-[#6B7280] hover:text-[#1E3A8A] uppercase tracking-widest"
                >
                  Change registration details
                </button>
              </div>
            )}
          </form>

          {!otpSent && (
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
                  onError={() => setError('Google Signup Failed')}
                  useOneTap
                  theme="outline"
                  shape="circle"
                  text="signup_with"
                  width="100%"
                />
              </div>
            </div>
          )}

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
  <div className="flex items-center gap-3 text-white/80">
    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
      {icon}
    </div>
    <span className="text-sm font-semibold tracking-wide">{text}</span>
  </div>
)

export default Signup