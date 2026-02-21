import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../lib/api.js'
import { Mail, ArrowLeft, Loader2, CheckCircle, ChevronRight, ShieldQuestion } from 'lucide-react'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await authAPI.forgotPassword(email)
            if (response.success) {
                setSubmitted(true)
                setMessage(response.message || 'If an account exists with this email, you will receive a reset link shortly.')
            } else {
                setError(response.message || 'Failed to send reset email.')
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[#E5E7EB] shadow-sm mb-6 hover:shadow-md transition-shadow group">
                        <span className="text-[#1E3A8A] text-2xl font-black italic group-hover:scale-110 transition-transform">D</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Forgot Password</h1>
                    <p className="text-[#6B7280] font-medium leading-relaxed">No worries, it happens! Enter your email and we'll help you get back in.</p>
                </div>

                <div className="bg-white border border-[#E5E7EB] p-8 lg:p-10 rounded-[2.5rem] shadow-xl">
                    {submitted ? (
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="h-20 w-20 bg-green-50 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1F2937] mb-3">Email Sent!</h2>
                            <p className="text-[#6B7280] mb-8 font-medium leading-relaxed">{message}</p>
                            <Link to="/login" className="block w-full h-14 bg-[#1E3A8A] hover:bg-[#1e40af] text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-blue-500/10">
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="p-4 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold">{error}</div>}

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border border-[#E5E7EB] text-[#1F2937] placeholder:text-[#9CA3AF] rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none font-semibold"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-[#1E3A8A] hover:bg-[#1e40af] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
                            </button>

                            <div className="pt-4 text-center">
                                <Link to="/login" className="text-sm font-bold text-[#6B7280] hover:text-[#1F2937] flex items-center justify-center gap-2 transition-colors">
                                    <ArrowLeft className="h-4 w-4" /> Remembered? Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
