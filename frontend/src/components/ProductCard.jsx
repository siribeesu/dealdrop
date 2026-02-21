import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Star, ShoppingCart, Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProductCard = ({ product }) => {
  const { isAuthenticated, addToWishlist, removeFromWishlist, wishlist } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && wishlist) {
      setIsInWishlist(wishlist.some(item => (item._id || item) === product._id))
    }
  }, [isAuthenticated, wishlist, product._id])

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      alert('Please login to save to wishlist')
      return
    }

    setLoading(true)
    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id)
      } else {
        await addToWishlist(product._id)
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const r = rating || 4.5
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= Math.round(r) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
        />
      )
    }
    return stars
  }

  return (
    <div className="group bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image */}
      <Link to={`/product/${product._id}`} className="relative block aspect-square overflow-hidden bg-[#F8FAFC]">
        <img
          src={product.images?.[0]?.url || product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
            Low Stock
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlistToggle}
          disabled={loading}
          className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${isInWishlist
              ? 'bg-red-500 text-white'
              : 'bg-white text-[#6B7280] hover:text-red-500 hover:bg-red-50'
            }`}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1">
          {product.category}
        </span>

        {/* Name - 2 lines max */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-[15px] font-semibold text-[#1F2937] mb-2 line-clamp-2 leading-snug hover:text-[#2563EB] transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {renderStars(product.averageRating)}
          </div>
          <span className="text-xs text-[#9CA3AF] font-medium">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#E5E7EB]/60">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#16A34A]"
              style={{ fontFamily: 'Poppins, sans-serif' }}>
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-[#9CA3AF] line-through">₹{product.originalPrice}</span>
            )}
          </div>

          <button className="h-9 w-9 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
