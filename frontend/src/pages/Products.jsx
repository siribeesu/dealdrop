import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productsAPI } from '../lib/api'
import { Input } from '../components/ui/input'
import { Search, SlidersHorizontal, X, ShoppingBag, Loader2, ChevronRight } from 'lucide-react'

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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productsAPI.getProducts()
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
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  // Update URL params
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== 'All') params.category = selectedCategory;
    setSearchParams(params);
  }, [searchTerm, selectedCategory, setSearchParams]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                All Products
              </h1>
              <nav className="flex items-center gap-2 text-sm text-[#6B7280]">
                <a href="/" className="hover:text-[#1E3A8A]">Home</a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[#1F2937] font-semibold">Shop</span>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-80">
                <Input
                  placeholder="Search for items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-[#F8FAFC] border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all font-medium"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              </div>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden h-12 w-12 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#1F2937] bg-white transition-all active:scale-95 shadow-sm"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 space-y-10">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1F2937] mb-6">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === category
                          ? 'bg-[#1E3A8A] text-white shadow-md shadow-blue-900/10'
                          : 'text-[#6B7280] hover:bg-white hover:text-[#1F2937]'
                        }`}
                    >
                      {category}
                      {selectedCategory !== category && (
                        <div className="h-2 w-2 rounded-full bg-transparent group-hover:bg-[#1E3A8A]/20 transition-all"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Card */}
              <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white overflow-hidden relative">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-2">Member early access</p>
                  <h4 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Get 20% OFF</h4>
                  <button className="text-xs font-bold px-4 py-2 bg-white text-[#1E3A8A] rounded-lg hover:bg-[#F97316] hover:text-white transition-colors">
                    Join Today
                  </button>
                </div>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-white/5 rounded-full blur-xl"></div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-medium text-[#6B7280]">
                Showing <span className="text-[#1F2937] font-bold">{filteredProducts.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#9CA3AF] uppercase truncate">Sort by:</span>
                <select className="text-sm font-bold text-[#1F2937] bg-transparent outline-none cursor-pointer">
                  <option>Latest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Best Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E5E7EB]">
                <div className="h-20 w-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="h-10 w-10 text-[#9CA3AF]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1F2937] mb-2">No products found</h3>
                <p className="text-[#6B7280] max-w-sm mx-auto mb-8">
                  We couldn't find any items matching your search. Try different keywords or a different category.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  className="btn-primary"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileFilters(false)}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#1F2937]">Filter By</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#1F2937]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 pb-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-6">Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowMobileFilters(false);
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${selectedCategory === category
                          ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white'
                          : 'bg-white border-[#E5E7EB] text-[#6B7280]'
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
      )}
    </div>
  )
}

export default Products
