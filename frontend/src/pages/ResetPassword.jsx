import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../lib/api'
import { Lock, Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('idle') // idle, success, error
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setStatus('error')
            setMessage('Passwords do not match.')
            return
        }

        setLoading(true)
        setStatus('idle')
        try {
            const response = await authAPI.resetPassword(token, password)
            if (response.success) {
                setStatus('success')
                setMessage(response.message || 'Success! Your password has been updated.')
                setTimeout(() => navigate('/login'), 3000)
            } else {
                setStatus('error')
                setMessage(response.message || 'Failed to reset password.')
            }
        } catch (err) {
            setStatus('error')
            setMessage('An error occurred. The link may be expired.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[#E5E7EB] shadow-sm mb-6 hover:shadow-md transition-shadow group">
                        <span className="text-[#1E3A8A] text-2xl font-black italic group-hover:scale-110 transition-transform">D</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Secure Reset</h1>
                    <p className="text-[#6B7280] font-medium leading-relaxed">Please choose a strong password you haven't used before.</p>
                </div>

                <div className="bg-white border border-[#E5E7EB] p-8 lg:p-10 rounded-[2.5rem] shadow-xl">
                    {status === 'success' ? (
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="h-20 w-20 bg-green-50 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1F2937] mb-3">Restored!</h2>
                            <p className="text-[#6B7280] mb-8 font-medium leading-relaxed">{message}</p>
                            <div className="flex items-center justify-center gap-3 text-sm font-bold text-[#1E3A8A]">
                                <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to login...
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="p-4 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold flex items-center gap-3">
                                    <XCircle className="h-5 w-5 shrink-0" />
                                    <span>{message}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border border-[#E5E7EB] text-[#1F2937] placeholder:text-[#9CA3AF] rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none font-semibold"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border border-[#E5E7EB] text-[#1F2937] placeholder:text-[#9CA3AF] rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all outline-none font-semibold"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-[#1E3A8A] hover:bg-[#1e40af] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
