import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X, ChevronDown, Shield, LayoutDashboard, UserCircle, Heart, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from './Logo'

const Navbar = () => {
  const { isAuthenticated, user, logout, wishlist } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-[#E5E7EB]'
        : 'bg-[#1E3A8A]'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <Logo isScrolled={isScrolled} />
          </Link>

          {/* Center: Categories */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavLink to="/" label="Home" active={location.pathname === '/'} isScrolled={isScrolled} />
            <NavLink to="/products" label="Shop" active={location.pathname === '/products'} isScrolled={isScrolled} />
            <NavLink to="/products?category=electronics" label="Electronics" isScrolled={isScrolled} />
            <NavLink to="/products?category=fashion" label="Fashion" isScrolled={isScrolled} />
          </div>

          {/* Right: Search + Icons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Inline search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-48 lg:w-56 h-9 pl-9 pr-3 text-sm rounded-xl border transition-all duration-200 focus:w-64 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 ${isScrolled
                    ? 'bg-[#F8FAFC] border-[#E5E7EB] text-[#1F2937] placeholder-[#9CA3AF]'
                    : 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20'
                  }`}
              />
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isScrolled ? 'text-[#9CA3AF]' : 'text-white/60'
                }`} />
            </form>

            {/* Wishlist */}
            <Link to="/wishlist" className={`relative p-2 rounded-xl transition-colors ${isScrolled ? 'text-[#1F2937] hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}>
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className={`relative p-2 rounded-xl transition-colors ${isScrolled ? 'text-[#1F2937] hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}>
              <ShoppingCart className="h-5 w-5" />
              <span className={`absolute -top-0.5 -right-0.5 h-4 w-4 text-white text-[10px] font-bold flex items-center justify-center rounded-full ${isScrolled ? 'bg-[#1E3A8A]' : 'bg-[#F97316]'
                }`}>
                0
              </span>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${isScrolled ? 'hover:bg-gray-100 text-[#1F2937]' : 'hover:bg-white/10 text-white'
                  }`}>
                  <div className="h-8 w-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-sm font-bold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden lg:inline">{user?.firstName || 'Account'}</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-[100]">
                  <div className="px-4 py-3 border-b border-[#E5E7EB]">
                    <p className="text-xs text-[#9CA3AF] font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-[#1F2937] truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <DropdownLink to="/profile" icon={<UserCircle className="h-4 w-4" />} label="My Profile" />
                    <DropdownLink to="/orders" icon={<ShoppingCart className="h-4 w-4" />} label="My Orders" />
                    <DropdownLink to="/wishlist" icon={<Heart className="h-4 w-4" />} label="Wishlist" />
                    {user?.role === 'admin' && (
                      <>
                        <div className="my-1 border-t border-[#E5E7EB]"></div>
                        <DropdownLink to="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Admin Dashboard" highlight />
                      </>
                    )}
                  </div>
                  <div className="border-t border-[#E5E7EB] py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isScrolled
                    ? 'bg-[#F97316] text-white hover:bg-[#EA580C] shadow-sm'
                    : 'bg-white text-[#1E3A8A] hover:bg-gray-50'
                  }`}>
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart" className={`p-2 rounded-lg ${isScrolled ? 'text-[#1F2937]' : 'text-white'}`}>
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isScrolled ? 'text-[#1F2937] hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E7EB] shadow-lg">
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl placeholder-[#9CA3AF] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            </form>
          </div>
          <div className="px-2 py-2 space-y-0.5">
            <MobileLink to="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink to="/products" label="Shop" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink to="/products?category=electronics" label="Electronics" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink to="/products?category=fashion" label="Fashion" onClick={() => setIsMobileMenuOpen(false)} />
            {isAuthenticated ? (
              <>
                <div className="my-1 border-t border-[#E5E7EB]"></div>
                <MobileLink to="/profile" label="Profile" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileLink to="/wishlist" label={`Wishlist (${wishlist.length})`} onClick={() => setIsMobileMenuOpen(false)} />
                <MobileLink to="/orders" label="My Orders" onClick={() => setIsMobileMenuOpen(false)} />
                {user?.role === 'admin' && (
                  <MobileLink to="/admin" label="Admin Dashboard" onClick={() => setIsMobileMenuOpen(false)} highlight />
                )}
                <div className="my-1 border-t border-[#E5E7EB]"></div>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block mx-2 mt-2 px-4 py-2.5 bg-[#F97316] text-white font-semibold rounded-xl text-center text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

const NavLink = ({ to, label, active, isScrolled }) => (
  <Link
    to={to}
    className={`text-[15px] font-medium transition-colors duration-200 py-1 ${isScrolled
        ? `${active ? 'text-[#1E3A8A] font-semibold' : 'text-[#6B7280] hover:text-[#1F2937]'}`
        : `${active ? 'text-white font-semibold' : 'text-white/80 hover:text-white'}`
      }`}
  >
    {label}
  </Link>
)

const MobileLink = ({ to, label, onClick, highlight }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${highlight
        ? 'text-[#1E3A8A] bg-blue-50 hover:bg-blue-100'
        : 'text-[#1F2937] hover:bg-[#F8FAFC]'
      }`}
  >
    {label}
  </Link>
)

const DropdownLink = ({ to, icon, label, highlight }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2.5 px-4 py-2 text-sm transition-colors ${highlight
        ? 'text-[#1E3A8A] font-medium hover:bg-blue-50'
        : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8FAFC]'
      }`}
  >
    <span className={highlight ? 'text-[#1E3A8A]' : 'text-[#9CA3AF]'}>{icon}</span>
    <span>{label}</span>
  </Link>
)

export default Navbar
