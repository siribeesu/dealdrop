import React, { useState } from 'react'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, Headphones } from 'lucide-react'

const HeroBanner = () => {
  return (
    <section className="relative bg-[#1E3A8A] overflow-hidden" style={{ minHeight: '70vh' }}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text left */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-sm font-medium mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F97316] animate-pulse"></span>
              New Collection 2026
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white mb-6 leading-[1.15] tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}>
              Discover Premium<br />Products at the<br />
              <span className="text-[#F97316]">Best Prices</span>
            </h1>

            <p className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Shop from thousands of curated products with fast delivery, secure payments, and exceptional customer service.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products">
                <button className="h-12 px-8 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-base font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 flex items-center gap-2 active:scale-[0.98]">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/products?featured=true">
                <button className="h-12 px-8 bg-white/10 hover:bg-white/15 text-white rounded-xl text-base font-semibold border border-white/20 transition-all duration-200 active:scale-[0.98]">
                  View Deals
                </button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
              <TrustItem icon={<Truck className="h-4 w-4" />} text="Free Shipping" />
              <TrustItem icon={<ShieldCheck className="h-4 w-4" />} text="Secure Payment" />
              <TrustItem icon={<Headphones className="h-4 w-4" />} text="24/7 Support" />
            </div>
          </div>

          {/* Image right */}
          <div className="hidden lg:block relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80"
                alt="Shopping Experience"
                className="rounded-2xl shadow-2xl w-full h-auto max-h-[480px] object-cover"
              />
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg px-5 py-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[#1F2937] font-semibold text-sm">Trusted by 10K+</p>
                  <p className="text-[#9CA3AF] text-xs">Happy customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const TrustItem = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-white/80">
    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-sm font-medium">{text}</span>
  </div>
)

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export default HeroBanner
