import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Mail, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/ui/Logo'

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await login(credentials)
            if (response.success) {
                if (response.user.role === 'admin') navigate('/admin')
                else setError('Access denied. Administrator privileges required.')
            } else setError(response.message || 'Invalid credentials')
        } catch (error) {
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A] relative overflow-hidden font-sans">
            {/* Abstract Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="w-full max-w-md p-6 relative z-10">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex mb-6 group transition-transform hover:scale-105">
                        <Logo dark={true} />
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Admin Console</h1>
                    <p className="text-slate-400 font-medium">Secure authentication for DealDrop </p>
                </div>

                <div className="bg-[#1E293B] border border-white/5 p-8 lg:p-10 rounded-[2.5rem] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    placeholder="admin@dealdrop.com"
                                    className="w-full h-12 pl-12 pr-4 bg-black/20 border border-white/5 text-white placeholder:text-slate-600 rounded-xl focus:border-blue-500/50 transition-all outline-none font-semibold"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full h-12 pl-12 pr-4 bg-black/20 border border-white/5 text-white placeholder:text-slate-600 rounded-xl focus:border-blue-500/50 transition-all outline-none font-semibold"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>
                                    <Shield className="h-5 w-5" />
                                    <span>Enter Dashboard</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Not an admin? Customer Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
