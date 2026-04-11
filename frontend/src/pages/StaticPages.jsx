import React from 'react'
import { HelpCircle, Truck, RotateCcw, Ruler, Package, ChevronRight, Mail, Phone, MessageSquare, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const StaticPageLayout = ({ title, icon: Icon, children }) => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 md:pb-24">
      <div className="bg-[#1E3A8A] pt-12 md:pt-16 pb-14 md:pb-32 px-4 sm:px-6 lg:px-8 text-center relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 md:top-12 left-4 md:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold text-xs md:text-sm bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-lg group active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        <div className="h-10 w-10 md:h-16 md:w-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-6 backdrop-blur-sm border border-white/20">
          <Icon className="h-5 w-5 md:h-8 md:w-8 text-white" />
        </div>
        <h1 className="text-xl md:text-5xl font-bold text-white mb-0.5 md:mb-4 px-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h1>
        <nav className="flex items-center justify-center gap-2 text-white/70 text-[10px] md:text-sm">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="text-white font-medium">{title}</span>
        </nav>
      </div>

    <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-4 md:-mt-20 relative z-10">
      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] pt-6 pb-10 px-6 md:p-12 shadow-2xl border border-[#E5E7EB]/50 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  </div>
  )
}

export const HelpCenter = () => (
  <StaticPageLayout title="Help Center" icon={HelpCircle}>
    <div className="space-y-10">
      <div className="grid grid-cols-3 gap-2 md:gap-6">
        <div className="p-3 md:p-6 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] text-center">
          <Mail className="h-5 w-5 md:h-6 md:w-6 text-[#1E3A8A] mx-auto mb-2 md:mb-4" />
          <h3 className="text-[10px] md:text-base font-bold mb-1">Email</h3>
          <p className="hidden md:block text-sm text-[#6B7280]">support@dealdrop.com</p>
        </div>
        <div className="p-3 md:p-6 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] text-center">
          <Phone className="h-5 w-5 md:h-6 md:w-6 text-[#1E3A8A] mx-auto mb-2 md:mb-4" />
          <h3 className="text-[10px] md:text-base font-bold mb-1">Call</h3>
          <p className="hidden md:block text-sm text-[#6B7280]">+91 1800-DEAL-DROP</p>
        </div>
        <div className="p-3 md:p-6 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] text-center">
          <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-[#1E3A8A] mx-auto mb-2 md:mb-4" />
          <h3 className="text-[10px] md:text-base font-bold mb-1">Chat</h3>
          <p className="hidden md:block text-sm text-[#6B7280]">Available 24/7</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-[#E5E7EB] pb-6">
            <h4 className="font-bold text-[#1F2937] mb-2">How do I track my order?</h4>
            <p className="text-[#6B7280]">Once your order is shipped, we will send you an email with a tracking number and a link to track it.</p>
          </div>
          <div className="border-b border-[#E5E7EB] pb-6">
            <h4 className="font-bold text-[#1F2937] mb-2">What is your return policy?</h4>
            <p className="text-[#6B7280]">We offer a 30-day hassle-free return policy for most items. Items must be in original condition with tags.</p>
          </div>
          <div className="border-b border-[#E5E7EB] pb-6">
            <h4 className="font-bold text-[#1F2937] mb-2">How long does shipping take?</h4>
            <p className="text-[#6B7280]">Normal shipping takes 3-5 business days. Express shipping takes 1-2 business days.</p>
          </div>
        </div>
      </div>
    </div>
  </StaticPageLayout>
)

export const ShippingInfo = () => (
  <StaticPageLayout title="Shipping Information" icon={Truck}>
    <div className="prose prose-slate max-w-none">
      <h3 className="text-xl font-bold mb-4">Domestic Shipping (India)</h3>
      <p className="text-[#6B7280] mb-6">We provide free standard shipping on all orders above ₹499. For orders below ₹499, a flat shipping fee of ₹40 is applied.</p>
      
      <table className="w-full text-left border-collapse mb-8 text-[11px] md:text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            <th className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">Shipping Method</th>
            <th className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">Delivery Time</th>
            <th className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2.5 md:p-4 border border-[#E5E7EB]">Standard Shipping</td>
            <td className="p-2.5 md:p-4 border border-[#E5E7EB]">3 - 5 Business Days</td>
            <td className="p-2.5 md:p-4 border border-[#E5E7EB]">FREE over ₹499</td>
          </tr>
          <tr>
            <td className="p-2.5 md:p-4 border border-[#E5E7EB]">Express Delivery</td>
            <td className="p-2.5 md:p-4 border border-[#E5E7EB]">1 - 2 Business Days</td>
            <td className="p-2.5 md:p-4 border border-[#E5E7EB]">₹150</td>
          </tr>
        </tbody>
      </table>

      <h3 className="text-xl font-bold mb-4">Order Processing</h3>
      <p className="text-[#6B7280]">Orders placed before 2:00 PM IST are processed and shipped the same business day. Orders placed after 2:00 PM or on weekends are processed the following business day.</p>
    </div>
  </StaticPageLayout>
)

export const ReturnPolicy = () => (
  <StaticPageLayout title="Return Policy" icon={RotateCcw}>
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4">30-Day Easy Returns</h3>
        <p className="text-[#6B7280]">At DealDrop, we want you to be completely satisfied with your purchase. If you're not happy with an item, you can return it within 30 days of delivery.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <h4 className="font-bold text-emerald-900 mb-2">What's Eligible?</h4>
          <ul className="text-sm text-emerald-800 space-y-2">
            <li>• Unworn and unwashed items</li>
            <li>• Original tags still attached</li>
            <li>• Items in original packaging</li>
            <li>• Defective or damaged products</li>
          </ul>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
          <h4 className="font-bold text-red-900 mb-2">Non-Returnable Items</h4>
          <ul className="text-sm text-red-800 space-y-2">
            <li>• Undergarments & Lingerie</li>
            <li>• Personalized or custom items</li>
            <li>• Sale items marked "Final Sale"</li>
            <li>• Gift cards</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">How to Return</h3>
        <ol className="list-decimal list-inside space-y-4 text-[#6B7280]">
          <li>Log in to your account and go to "My Orders".</li>
          <li>Select the item you wish to return and choose a reason.</li>
          <li>Pack the item securely and print the return label provided.</li>
          <li>A courier will pick up the package within 48 hours.</li>
          <li>Refund will be processed once the item reaches our warehouse.</li>
        </ol>
      </div>
    </div>
  </StaticPageLayout>
)

export const SizeGuide = () => (
  <StaticPageLayout title="Size Guide" icon={Ruler}>
    <div className="space-y-10">
      <p className="text-[#6B7280] text-lg text-center max-w-2xl mx-auto">
        Find your perfect fit with our comprehensive size charts. All measurements are in inches.
      </p>

      <div>
        <h3 className="text-xl font-bold mb-6 border-b border-[#E5E7EB] pb-2">Men's Shirts & Tops</h3>
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">Size</th>
              <th className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">Chest (in)</th>
              <th className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">Waist (in)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">S</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">36 - 38</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">30 - 32</td>
            </tr>
            <tr className="bg-[#F8FAFC]/50">
              <td className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">M</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">38 - 40</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">32 - 34</td>
            </tr>
            <tr>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">L</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">40 - 42</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">34 - 36</td>
            </tr>
            <tr className="bg-[#F8FAFC]/50">
              <td className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">XL</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">42 - 44</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">36 - 38</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-6 border-b border-[#E5E7EB] pb-2">Women's Dresses</h3>
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">Size</th>
              <th className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">Bust (in)</th>
              <th className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">Hip (in)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">XS (0-2)</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">32 - 33</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">34 - 35</td>
            </tr>
            <tr className="bg-[#F8FAFC]/50">
              <td className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">S (4-6)</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">34 - 35</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">36 - 37</td>
            </tr>
            <tr>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB] font-bold">M (8-10)</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">36 - 37</td>
              <td className="p-2.5 md:p-4 border border-[#E5E7EB]">38 - 39</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </StaticPageLayout>
)

export const TrackOrder = () => (
  <StaticPageLayout title="Track Your Order" icon={Package}>
    <div className="max-w-md mx-auto text-center space-y-8">
      <p className="text-[#6B7280]">Enter your order number and email address to get real-time updates on your delivery status.</p>
      
      <div className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-bold text-[#1F2937] mb-2">Order Number</label>
          <input 
            type="text" 
            placeholder="e.g. #DD-123456"
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none transition-all"
          />
        </div>
        <div className="text-left">
          <label className="block text-sm font-bold text-[#1F2937] mb-2">Email Address</label>
          <input 
            type="email" 
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none transition-all"
          />
        </div>
        <button className="w-full h-14 bg-[#1E3A8A] text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/10">
          Track Order
        </button>
      </div>

      <div className="pt-8 border-t border-[#E5E7EB]">
        <p className="text-xs text-[#9CA3AF]">Can't find your order number? Check your confirmation email or log in to your account.</p>
      </div>
    </div>
  </StaticPageLayout>
)
