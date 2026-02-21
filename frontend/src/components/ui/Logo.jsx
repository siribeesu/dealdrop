import React from 'react'

const Logo = ({ isScrolled, dark = false }) => {
    const primaryColor = dark ? '#ffffff' : (isScrolled ? '#1F2937' : '#ffffff')
    const accentColor = '#F97316'

    // Icon container background and cart color
    const containerClasses = dark
        ? 'bg-[#1E3A8A] text-white'
        : (isScrolled ? 'bg-[#1E3A8A] text-white' : 'bg-white text-[#1E3A8A]')

    return (
        <div className="flex items-center gap-2.5 group">
            {/* New Stylized Drop Cart Icon */}
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:shadow-md ${containerClasses}`}>
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                    {/* Cart Structure */}
                    <path
                        d="M3 4h3l1.5 9h10l2-6H8.5"
                        stroke="currentColor"
                        strokeWidth="2.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Precision Wheels */}
                    <circle cx="9.5" cy="17.5" r="1.2" fill="currentColor" />
                    <circle cx="16.5" cy="17.5" r="1.2" fill="currentColor" />
                </svg>
            </div>

            {/* Brand Typography */}
            <div className="flex items-baseline">
                <span className="text-2xl font-black tracking-tight transition-colors duration-200"
                    style={{ fontFamily: 'Poppins, sans-serif', color: primaryColor }}>
                    Deal
                </span>
                <span className="text-2xl font-black tracking-tight transition-colors duration-200"
                    style={{ fontFamily: 'Poppins, sans-serif', color: accentColor }}>
                    Drop
                </span>
            </div>
        </div>
    )
}

export default Logo
