import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X, ChevronDown, Shield, LayoutDashboard, UserCircle, Heart, Search, Package } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import Logo from './Logo.jsx'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, user, logout, wishlist } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClick = () => setIsProfileOpen(false);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#1E3A8A] shadow-md`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Left: Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-xl transition-all active:scale-95"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <Logo isScrolled={false} />
          </Link>

          {/* Center: Fashion Categories (Desktop) */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink to="/" label="Home" active={location.pathname === '/'} />
            <NavLink to="/products" label="Shop All" active={location.pathname === '/products' && !location.search} />
            <NavLink to="/products?category=Men" label="Men" />
            <NavLink to="/products?category=Women" label="Women" />
            <Link to="/products?featured=true" className="text-sm font-bold px-5 py-2 rounded-xl bg-[#F97316] text-white hover:bg-[#EA580C] shadow-lg shadow-orange-500/20 transition-all active:scale-95">
              Limited Deals
            </Link>
          </div>

          {/* Right: Search + Icons */}
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="hidden sm:block relative">
              <input
                type="text"
                placeholder="Search fashion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 h-10 pl-10 pr-4 text-sm rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            </form>

            <div className="hidden md:flex items-center space-x-1 md:space-x-2">
              <NavIcon to="/wishlist" icon={<Heart className="h-5 w-5" />} count={wishlist.length} />
              <NavIcon to="/orders" icon={<Package className="h-5 w-5" />} />
              <NavIcon to="/cart" icon={<ShoppingCart className="h-5 w-5" />} />
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen) }}
                  className="flex items-center space-x-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-all duration-200 hover:bg-white/10 text-white"
                >
                  <div className="h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border bg-white/20 text-white border-white/30 shadow-sm">
                    {user?.firstName?.charAt(0) || <User className="h-4 w-4" />}
                  </div>
                  <ChevronDown className={`hidden md:block h-4 w-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
                    <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                      <div className="p-4 bg-[#F8FAFC] border-b border-[#E5E7EB]">
                        <p className="text-sm font-bold text-[#1F2937] truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[11px] font-medium text-[#6B7280] truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <DropdownLink to="/profile" icon={<UserCircle className="h-4 w-4" />} label="My Profile" />
                        <DropdownLink to="/orders" icon={<Package className="h-4 w-4" />} label="My Orders" />
                        <DropdownLink to="/wishlist" icon={<Heart className="h-4 w-4" />} label="Wishlist" />
                        <DropdownLink to="/cart" icon={<ShoppingCart className="h-4 w-4" />} label="My Cart" />
                        {user?.role === 'admin' && (
                          <>
                            <div className="my-1 border-t border-[#E5E7EB]"></div>
                            <DropdownLink to="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Admin Dashboard" highlight />
                          </>
                        )}
                      </div>
                      <div className="border-t border-[#E5E7EB] bg-gray-50/50 p-2">
                        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all active:scale-[0.98]">
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="hidden sm:block px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 bg-[#F97316] text-white hover:bg-[#EA580C] shadow-lg shadow-orange-500/20 active:scale-95">
                  Sign In
                </button>
                <div className="sm:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-all active:scale-90">
                  <User className="h-6 w-6" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 w-3/4 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300 overflow-y-auto">
            <div className="p-6 bg-[#1E3A8A] text-white flex items-center justify-between">
              <Logo isScrolled={false} white />
              <button onClick={() => setIsMobileMenuOpen(false)}><X className="h-6 w-6" /></button>
            </div>
            <div className="p-4 space-y-2">
              <MobileLink to="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileLink to="/products" label="Shop All" onClick={() => setIsMobileMenuOpen(false)} highlight />
              <MobileLink to="/products?category=Men" label="Men's Fashion" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileLink to="/products?category=Women" label="Women's Fashion" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="my-4 border-t border-[#E5E7EB]"></div>
              <MobileLink to="/orders" label="Track Orders" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileLink to="/wishlist" label="Wishlist" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileLink to="/cart" label="Shopping Cart" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="text-xs font-bold text-[#F97316] uppercase tracking-widest mb-2">Summer Sale</p>
                <p className="text-sm font-bold text-[#1F2937] mb-4">Up to 60% off on all collections!</p>
                <Link to="/products?featured=true" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-2.5 bg-[#F97316] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                  Shop Deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

const NavLink = ({ to, label, active, dark }) => (
  <Link
    to={to}
    className={`px-4 py-2 text-base font-bold transition-all duration-300 ${
      active ? 'text-[#F97316]' : 'text-white hover:text-white/80'
    }`}
  >
    {label}
  </Link>
)

const MobileLink = ({ to, label, onClick, highlight }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${highlight
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

const NavIcon = ({ to, icon, count, dark }) => (
  <Link
    to={to}
    className="relative p-2 rounded-xl transition-all duration-300 active:scale-90 text-white hover:bg-white/10"
  >
    {icon}
    {count > 0 && (
      <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
        {count}
      </span>
    )}
  </Link>
)

export default Navbar
