import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, Heart, Package, ShoppingCart, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

const MobileNav = () => {
  const location = useLocation()
  const { user, isAuthenticated, wishlist } = useAuth()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Shop', icon: ShoppingBag, path: '/products' },
    { label: 'Wishlist', icon: Heart, path: '/wishlist', badge: wishlist?.length },
    { label: 'Orders', icon: Package, path: '/orders' },
    { label: 'Cart', icon: ShoppingCart, path: '/cart', badge: user?.cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) }
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-95 select-none ${
              isActive(item.path) ? 'text-[#1E3A8A]' : 'text-[#9CA3AF]'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className={`relative p-2 rounded-xl transition-colors ${isActive(item.path) ? 'bg-blue-50' : ''}`}>
              <item.icon className="h-5 w-5" />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#F97316] text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            {isActive(item.path) && (
              <div className="absolute bottom-1 w-5 h-0.5 bg-[#1E3A8A] rounded-full"></div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default MobileNav
