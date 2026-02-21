import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ProductCard from '../components/ProductCard'
import { Heart, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react'

const Wishlist = () => {
    const { wishlist, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 flex items-center justify-center">
                <div className="max-w-md w-full px-6 text-center">
                    <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-[#E5E7EB]">
                        <Heart className="h-10 w-10 text-red-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#1F2937] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Your Wishlist
                    </h1>
                    <p className="text-[#6B7280] mb-8 font-medium">
                        Log in to see your saved items and get the best deals on the products you love.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link to="/login">
                            <button className="w-full h-14 bg-[#1E3A8A] hover:bg-[#1e40af] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]">
                                Sign In
                            </button>
                        </Link>
                        <Link to="/products" className="text-sm font-bold text-[#6B7280] hover:text-[#1F2937] transition-colors">
                            Explore Products
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            My Favorites
                        </h1>
                        <nav className="flex items-center gap-2 text-sm text-[#6B7280]">
                            <Link to="/" className="hover:text-[#1E3A8A]">Home</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-[#1F2937] font-semibold">Wishlist</span>
                        </nav>
                    </div>
                    <Link to="/products" className="flex items-center gap-2 text-sm font-bold text-[#1E3A8A] hover:text-[#2563EB] transition-colors group">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Continue Shopping
                    </Link>
                </div>

                {wishlist && wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm">
                        <div className="h-20 w-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-6 text-[#9CA3AF]">
                            <Heart className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            No favorites yet
                        </h2>
                        <p className="text-[#6B7280] max-w-sm mx-auto mb-8 font-medium">
                            Start adding items you love to your wishlist to keep track of them and get price drop alerts.
                        </p>
                        <Link to="/products">
                            <button className="btn-primary">
                                Explore Collection
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wishlist
