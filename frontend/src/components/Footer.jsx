import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#1E3A8A] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center">
                <span className="text-[#1E3A8A] text-lg font-black italic">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Deal<span className="text-[#F97316]">Drop</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Your trusted destination for premium products at unbeatable prices. Shop with confidence.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-3">Stay Updated</p>
              <div className="relative max-w-xs">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-10 pl-4 pr-10 text-sm bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 transition-all"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 bg-[#F97316] hover:bg-[#EA580C] rounded-lg flex items-center justify-center transition-colors">
                  <ArrowRight className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Shop */}
          <FooterSection
            title="Shop"
            links={[
              { label: 'All Products', to: '/products' },
              { label: 'New Arrivals', to: '/products?sort=newest' },
              { label: 'Featured', to: '/products' },
              { label: 'Categories', to: '/products' }
            ]}
          />

          {/* Help */}
          <FooterSection
            title="Help"
            links={[
              { label: 'Help Center', to: '/#' },
              { label: 'Shipping Info', to: '/#' },
              { label: 'Return Policy', to: '/#' },
              { label: 'Track Order', to: '/#' },
              { label: 'Admin Access', to: '/admin-login' }
            ]}
          />

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Contact
            </h4>
            <div className="space-y-3">
              <ContactItem icon={<Mail className="h-4 w-4" />} text="support@dealdrop.io" />
              <ContactItem icon={<Phone className="h-4 w-4" />} text="+91 98765 43210" />
              <ContactItem icon={<MapPin className="h-4 w-4" />} text="Mumbai, India" />
            </div>
            <div className="flex space-x-3 mt-5">
              <SocialIcon icon={<Facebook />} />
              <SocialIcon icon={<Twitter />} />
              <SocialIcon icon={<Instagram />} />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            &copy; 2026 DealDrop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/#" className="text-white/40 hover:text-white text-sm transition-colors">Privacy</Link>
            <Link to="/#" className="text-white/40 hover:text-white text-sm transition-colors">Terms</Link>
            <Link to="/#" className="text-white/40 hover:text-white text-sm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

const FooterSection = ({ title, links }) => (
  <div>
    <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {title}
    </h4>
    <ul className="space-y-2.5">
      {links.map((link, i) => (
        <li key={i}>
          <Link to={link.to} className="text-sm text-white/50 hover:text-[#F97316] transition-colors">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

const ContactItem = ({ icon, text }) => (
  <div className="flex items-center gap-2.5 text-white/50">
    <span className="text-white/30">{icon}</span>
    <span className="text-sm">{text}</span>
  </div>
)

const SocialIcon = ({ icon }) => (
  <a href="#" className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:bg-[#F97316] hover:text-white transition-all duration-200">
    {React.cloneElement(icon, { size: 16 })}
  </a>
)

export default Footer
