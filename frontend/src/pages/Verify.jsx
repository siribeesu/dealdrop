import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { authAPI } from '../lib/api'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

const Verify = () => {
    const { token } = useParams()
    const [status, setStatus] = useState('verifying') // verifying, success, error
    const [message, setMessage] = useState('')

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const response = await authAPI.verifyEmail(token)
                if (response.success) {
                    setStatus('success')
                    setMessage(response.message || 'Email verified successfully!')
                } else {
                    setStatus('error')
                    setMessage(response.message || 'Verification failed.')
                }
            } catch (error) {
                setStatus('error')
                setMessage(error.message || 'Something went wrong.')
            }
        }
        if (token) {
            verifyAccount()
        }
    }, [token])

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0f1c] relative overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Background Animated Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <div className="w-full max-w-md p-6 relative z-10">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center">
                    {status === 'verifying' && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">Verifying Account</h2>
                            <p className="text-slate-400">Please wait while we confirm your email...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">Verified!</h2>
                            <p className="text-slate-400 mb-8">{message}</p>
                            <Link to="/login" className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                                Go to Login
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6">
                                <XCircle className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">Verification Failed</h2>
                            <p className="text-slate-400 mb-8">{message}</p>
                            <Link to="/signup" className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all">
                                Back to Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Verify