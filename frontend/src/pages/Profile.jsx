import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, User, Mail, Phone, MapPin, Loader2, ChevronRight, ShieldCheck, Lock, Edit3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('profile')

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: {
          street: user.profile?.address?.street || '',
          city: user.profile?.address?.city || '',
          state: user.profile?.address?.state || '',
          zipCode: user.profile?.address?.zipCode || '',
          country: user.profile?.address?.country || ''
        }
      })
    }
  }, [user])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setProfileData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }))
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const result = await updateProfile(profileData)
      if (result.success) setMessage('Profile updated successfully!')
      else setError(result.message || 'Failed to update profile')
    } catch (err) {
      setError('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      if (result.success) {
        setMessage('Password changed successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else setError(result.message || 'Failed to change password')
    } catch (err) {
      setError('Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            My Account
          </h1>
          <nav className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Link to="/" className="hover:text-[#1E3A8A]">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#1F2937] font-semibold">Settings</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-2 shadow-sm sticky top-24">
              <NavButton
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
                icon={<User className="h-4 w-4" />}
                label="Profile Info"
              />
              <NavButton
                active={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
                icon={<Lock className="h-4 w-4" />}
                label="Security"
              />
              <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#6B7280] hover:bg-gray-50 transition-colors">
                <Edit3 className="h-4 w-4" /> Order History
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {message && <div className="p-4 bg-green-50 text-[#16A34A] border border-green-100 rounded-xl text-sm font-semibold">{message}</div>}
            {error && <div className="p-4 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold">{error}</div>}

            {activeTab === 'profile' ? (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <div className="bg-[#F8FAFC] border-b border-[#E5E7EB] px-8 py-6">
                    <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                      <User className="h-5 w-5 text-[#1E3A8A]" /> Personal Details
                    </h2>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileInput label="First Name" name="firstName" value={profileData.firstName} onChange={handleProfileChange} />
                      <ProfileInput label="Last Name" name="lastName" value={profileData.lastName} onChange={handleProfileChange} />
                    </div>
                    <ProfileInput label="Email Address" type="email" name="email" value={profileData.email} onChange={handleProfileChange} icon={<Mail className="h-4 w-4" />} />
                    <ProfileInput label="Phone Number" type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} icon={<Phone className="h-4 w-4" />} />
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <div className="bg-[#F8FAFC] border-b border-[#E5E7EB] px-8 py-6">
                    <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#1E3A8A]" /> Shipping Address
                    </h2>
                  </div>
                  <div className="p-8 space-y-6">
                    <ProfileInput label="Street Address" name="address.street" value={profileData.address.street} onChange={handleProfileChange} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <ProfileInput label="City" name="address.city" value={profileData.address.city} onChange={handleProfileChange} />
                      <ProfileInput label="State" name="address.state" value={profileData.address.state} onChange={handleProfileChange} />
                      <ProfileInput label="ZIP Code" name="address.zipCode" value={profileData.address.zipCode} onChange={handleProfileChange} />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto h-12 px-10">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <div className="bg-[#F8FAFC] border-b border-[#E5E7EB] px-8 py-6">
                    <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-[#1E3A8A]" /> Update Password
                    </h2>
                  </div>
                  <div className="p-8 space-y-6 max-w-xl">
                    <ProfileInput
                      label="Current Password"
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      toggleVisibility={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                      isPassword={true}
                      isVisible={showPasswords.current}
                    />
                    <ProfileInput
                      label="New Password"
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      toggleVisibility={() => setShowPasswords(p => ({ ...p, new: !p.current }))}
                      isPassword={true}
                      isVisible={showPasswords.new}
                    />
                    <ProfileInput
                      label="Confirm Password"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      toggleVisibility={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                      isPassword={true}
                      isVisible={showPasswords.confirm}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto h-12 px-10">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Change Password'}
                </button>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

/* Sub-components */
const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-[#6B7280] hover:bg-gray-50'
      }`}
  >
    {icon} {label}
  </button>
)

const ProfileInput = ({ label, name, value, onChange, type = "text", icon, isPassword, isVisible, toggleVisibility }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] ml-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">{icon}</div>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full h-12 ${icon ? 'pl-11' : 'px-4'} ${isPassword ? 'pr-11' : ''} rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] font-semibold transition-all focus:ring-2 focus:ring-[#1E3A8A]/10 outline-none`}
      />
      {isPassword && (
        <button type="button" onClick={toggleVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937]">
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  </div>
)

export default Profile
