import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Share2, Truck, ShieldCheck, RotateCcw, Loader2, ArrowRight, Check, Minus, Plus } from 'lucide-react'
import { productsAPI, cartAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const { isAuthenticated, addToWishlist, removeFromWishlist, wishlist } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await productsAPI.getProduct(id)
        if (response.success) {
          setProduct(response.product)
        } else {
          setError('Product not found')
        }
      } catch (error) {
        setError('Failed to load product. Please try again.')
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product && wishlist) {
      setIsInWishlist(wishlist.some(item => (item._id || item) === product._id))
    }
  }, [product, wishlist])

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      alert('Please login to manage your wishlist')
      return
    }

    try {
      setWishlistLoading(true)
      if (isInWishlist) {
        await removeFromWishlist(product._id)
      } else {
        await addToWishlist(product._id)
      }
    } catch (error) {
      console.error('Wishlist error:', error)
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      const response = await cartAPI.addToCart({ productId: product._id, quantity })
      if (response.success) {
        alert('Product added to cart successfully!')
      } else {
        alert('Failed to add product to cart.')
      }
    } catch (error) {
      alert('Error adding to cart.')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="h-10 w-10 text-[#1E3A8A] animate-spin" />
    </div>
  )

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center px-4">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-4">Oops! {error || 'Product not found'}</h1>
        <Link to="/products" className="btn-primary inline-block">Back to Shop</Link>
      </div>
    </div>
  )

  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : [product.image || '/placeholder-product.jpg']

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm font-medium text-[#6B7280]">
          <Link to="/" className="hover:text-[#1E3A8A]">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-[#1E3A8A]">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-[#1F2937] truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-xl border-2 transition-all overflow-hidden bg-white shrink-0 ${selectedImage === idx ? 'border-[#1E3A8A]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-2 block">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] leading-tight mb-4"
                style={{ fontFamily: 'Poppins, sans-serif' }}>
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-[#6B7280]">
                  (12 customer reviews)
                </span>
                <span className="h-4 w-[1px] bg-[#E5E7EB]"></span>
                <span className={`text-sm font-bold ${product.stock > 0 ? 'text-[#16A34A]' : 'text-red-500'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-3xl font-bold text-[#16A34A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-[#9CA3AF] line-through">₹{product.originalPrice}</span>
                )}
                {product.originalPrice > product.price && (
                  <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <p className="text-[#4B5563] text-base leading-relaxed mb-8">
                {product.description.length > 200
                  ? `${product.description.substring(0, 200)}...`
                  : product.description}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-6 mb-10">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-[#E5E7EB] rounded-xl bg-white h-12">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-[#1F2937]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-[#1F2937]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleWishlistToggle}
                    className={`h-12 w-12 flex items-center justify-center rounded-xl border transition-all ${isInWishlist
                        ? 'bg-red-50 border-red-100 text-red-500'
                        : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1F2937]'
                      }`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                  <button className="h-12 w-12 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:bg-white hover:border-[#1F2937] transition-all">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock <= 0}
                className="w-full h-14 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E3A8A]">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F2937]">Free Delivery</p>
                  <p className="text-[11px] text-[#6B7280]">On orders above ₹499</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#16A34A]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F2937]">2 Year Warranty</p>
                  <p className="text-[11px] text-[#6B7280]">Authenticity guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description, Reviews */}
        <div className="mt-20">
          <div className="flex border-b border-[#E5E7EB] mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 px-6 text-sm font-bold tracking-tight transition-all relative ${activeTab === 'description' ? 'text-[#1E3A8A]' : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
            >
              Description
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1E3A8A] rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-6 text-sm font-bold tracking-tight transition-all relative ${activeTab === 'reviews' ? 'text-[#1E3A8A]' : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
            >
              Reviews (12)
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1E3A8A] rounded-t-full"></span>
              )}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 min-h-[200px]">
            {activeTab === 'description' ? (
              <div className="prose prose-slate max-w-none">
                <p className="text-[#4B5563] leading-relaxed mb-6">
                  {product.description}
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-10">
                  <div>
                    <h4 className="font-bold text-[#1F2937] mb-4">Product Highlights</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm text-[#4B5563]">
                        <Check className="h-4 w-4 text-[#16A34A]" /> Premium quality materials used
                      </li>
                      <li className="flex items-center gap-2 text-sm text-[#4B5563]">
                        <Check className="h-4 w-4 text-[#16A34A]" /> Ergonomic and modern design
                      </li>
                      <li className="flex items-center gap-2 text-sm text-[#4B5563]">
                        <Check className="h-4 w-4 text-[#16A34A]" /> Lightweight and durable build
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1F2937] mb-4">Shipping & Returns</h4>
                    <p className="text-sm text-[#4B5563] leading-relaxed">
                      Standard shipping usually takes 3-5 business days.
                      Returns are accepted within 30 days of purchase in original packaging.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Sample Review */}
                <div className="border-b border-[#F3F4F6] pb-8 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1E3A8A] font-bold">
                        JD
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1F2937]">John Doe</p>
                        <p className="text-xs text-[#9CA3AF]">Verified Purchase • 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    Absolutely love this product! The quality is even better than I expected.
                    Delivery was fast and the packaging was very secure. Highly recommend!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
