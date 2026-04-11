import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { productsAPI } from '../lib/api.js'
import { Input } from '../components/ui/input.jsx'
import { Search, SlidersHorizontal, X, ShoppingBag, Loader2, ChevronRight, ArrowLeft } from 'lucide-react'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Listen for URL changes and update state
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
    setSelectedCategory(searchParams.get('category') || 'All')
  }, [searchParams])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productsAPI.getProducts({ limit: 200 })
        if (response.success) {
          setProducts(response.products)
          setFilteredProducts(response.products)

          // Extract unique categories
          const uniqueCategories = ['All', ...new Set(response.products.map(product => product.category))]
          setCategories(uniqueCategories)
        }
      } catch (error) {
        setError('Failed to load products.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter logic
  useEffect(() => {
    let result = products;

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      result = result.filter(product =>
        product.name?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q)
      )
      // Sort: name matches first
      result = [...result].sort((a, b) => {
        const aName = a.name?.toLowerCase().startsWith(q) ? 0 : 1
        const bName = b.name?.toLowerCase().startsWith(q) ? 0 : 1
        return aName - bName
      })
    }

    if (selectedCategory !== 'All') {
      result = result.filter(product =>
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E5E7EB] pt-3 md:pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#1E3A8A] hover:border-[#1E3A8A] hover:bg-blue-50 transition-all shadow-sm shrink-0"
              title="Go Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              All Fashion
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-[#6B7280] ml-[64px]">
                <a href="/" className="hover:text-[#1E3A8A]">Home</a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[#1F2937] font-semibold">Shop</span>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <Input
                    value={searchTerm}
                    onChange={(e) => {
                      const nextParams = new URLSearchParams(searchParams)
                      if (e.target.value) nextParams.set('search', e.target.value)
                      else nextParams.delete('search')
                      setSearchParams(nextParams)
                    }}
                    placeholder="Search products..."
                    className="pl-9 h-11 bg-[#F8FAFC] border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all font-medium text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                </div>
                
                {(searchTerm || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchParams({});
                    }}
                    className="h-11 px-4 flex items-center gap-2 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold text-xs whitespace-nowrap active:scale-95 transition-all"
                  >
                    <X className="h-4 w-4" />
                    Reset
                  </button>
                )}
              </div>

              {/* Mobile Filter Pills */}
              <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      const nextParams = new URLSearchParams(searchParams)
                      if (category === 'All') nextParams.delete('category')
                      else nextParams.set('category', category)
                      setSearchParams(nextParams)
                    }}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all hover:shadow-sm ${selectedCategory === category
                      ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-md shadow-blue-900/10'
                      : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden md:block w-52 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1F2937] mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      const nextParams = new URLSearchParams(searchParams)
                      if (category === 'All') nextParams.delete('category')
                      else nextParams.set('category', category)
                      setSearchParams(nextParams)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCategory === category
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-[#6B7280] hover:bg-white hover:text-[#1F2937]'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-[#6B7280]">
                <span className="text-[#1F2937] font-bold">{filteredProducts.length}</span> items
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#9CA3AF] uppercase">Sort:</span>
                <select className="text-sm font-bold text-[#1F2937] bg-transparent outline-none cursor-pointer">
                  <option>Latest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                    <div className="aspect-square bg-gray-100 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-16"></div>
                      <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4"></div>
                      <div className="h-5 bg-gray-100 animate-pulse rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E5E7EB]">
                <div className="h-20 w-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="h-10 w-10 text-[#9CA3AF]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F2937] mb-2">No products found</h2>
                <p className="text-[#6B7280] max-w-sm mx-auto mb-8">
                  We couldn't find any items matching your search. Try different keywords or a different category.
                </p>
                <button
                  onClick={() => { setSearchParams({}); }}
                  className="btn-primary"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Products
