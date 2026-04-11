import React, { useState, useEffect } from 'react'
import { Button } from './ui/button.jsx'
import { Star, ShoppingCart, Heart, Plus, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { cartAPI } from '../lib/api.js'

const ProductCard = ({ product }) => {
  const { isAuthenticated, addToWishlist, removeFromWishlist, wishlist } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (isAuthenticated && wishlist && Array.isArray(wishlist)) {
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

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      alert('Please login to add items to your cart')
      return
    }

    try {
      setAddingToCart(true)
      const response = await cartAPI.addToCart({ productId: product._id, quantity: 1 })
      if (response.success) {
        // Success - no alert needed
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(false)
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
    <div className="group bg-white flex flex-col h-full border border-[#E5E7EB] hover:border-[#1E3A8A]/30 transition-shadow duration-300 rounded-xl overflow-hidden hover:shadow-lg">
      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="relative block aspect-square bg-[#F8FAFC] overflow-hidden rounded-t-xl">
        <img
          src={product.images?.[0]?.url || product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Wishlist Icon */}
        <button
          onClick={handleWishlistToggle}
          disabled={loading}
          className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all ${isInWishlist
            ? 'text-red-500'
            : 'text-[#6B7280] hover:text-red-500'
            }`}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Discount Badge */}
        {product.originalPrice > product.price && (
          <span className="absolute top-2 left-2 bg-[#F97316] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-tighter rounded-sm">
            Sale
          </span>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-3 flex flex-col items-center text-center flex-grow">
        <Link to={`/product/${product._id}`} className="w-full">
          <h3 className="text-[13px] font-bold text-[#1F2937] uppercase tracking-tight mb-1 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-[#1F2937]">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-[11px] text-[#9CA3AF] line-through">₹{product.originalPrice}</span>
          )}
        </div>

        <div className="flex items-center gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-2.5 w-2.5 ${i < (product.averageRating || 4) ? 'fill-[#F97316] text-[#F97316]' : 'fill-gray-200 text-gray-200'}`} 
            />
          ))}
        </div>

        {/* Add to Cart Bar - Solid Colored */}
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || product.stock <= 0}
          className="mt-auto w-full h-9 bg-[#1E3A8A] hover:bg-[#1e3a8aee] text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-lg shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
        >
          {addingToCart ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShoppingCart className="h-3 w-3" />}
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
