import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, RotateCcw, HelpCircle } from 'lucide-react'

const HeroBanner = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-[#1E3A8A] overflow-hidden">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="lg:grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Section */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-xs font-medium mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]"></span>
              New Collection 2026
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Discover Premium<br /> 
              Products at the<br />
              <span className="text-[#F97316]">Best Prices</span>
            </h1>

            <p className="text-sm md:text-base text-white/70 mb-10 max-w-lg leading-relaxed">
              Shop from thousands of curated products with fast delivery, 
              secure payments, and exceptional customer service.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/products">
                <button className="h-14 px-10 bg-[#FF7D29] hover:bg-[#F97316] text-white rounded-2xl text-base font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/products?deals=true">
                <button className="h-14 px-10 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-2xl text-base font-bold transition-all backdrop-blur-sm">
                  View Deals
                </button>
              </Link>
            </div>

            {/* Bottom: Service Items */}
            <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Truck className="h-4 w-4" />
                </div>
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                Secure Payment
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <HelpCircle className="h-4 w-4" />
                </div>
                24/7 Support
              </div>
            </div>
          </div>

          {/* Right: Image Section with Floating Card */}
          <div className="relative mt-12 lg:mt-0">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
                alt="Boutique Shop Interior"
                className="rounded-[2.5rem] shadow-2xl w-full h-[400px] lg:h-[500px] object-cover border-4 border-white/5"
              />
              
              {/* Floating Trusted Card */}
              <div className="absolute -bottom-6 -left-6 lg:-left-12 bg-white p-4 lg:p-6 rounded-3xl shadow-2xl flex items-center gap-4 animate-bounce-slow">
                <div className="h-12 w-12 lg:h-14 lg:w-14 bg-green-50 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 lg:h-7 lg:w-7 text-green-500" />
                </div>
                <div>
                  <div className="text-base lg:text-lg font-bold text-[#1F2937]">Trusted by 10K+</div>
                  <div className="text-xs lg:text-sm text-[#6B7280]">Happy customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
