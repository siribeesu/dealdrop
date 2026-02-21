import React, { useState, useEffect } from 'react'
import HeroBanner from '../components/HeroBanner'
import ProductCard from '../components/ProductCard'
import { productsAPI } from '../lib/api'
import { Link } from 'react-router-dom'
import { Package, Truck, LifeBuoy, ShieldCheck, ArrowRight, Zap, Star, CreditCard, Headphones } from 'lucide-react'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const [featuredRes, newRes] = await Promise.all([
          productsAPI.getProducts({ limit: 4, sort: 'newest' }),
          productsAPI.getProducts({ limit: 4, sort: 'newest', page: 2 }),
        ])
        if (featuredRes.success) setFeaturedProducts(featuredRes.products)
        if (newRes.success) setNewArrivals(newRes.products)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <HeroBanner />

      {/* Featured Products */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Hot Deals"
            title="Featured Products"
            link="/products"
            linkText="View All"
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <EmptyState message="No featured products yet" />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Explore"
            title="Shop by Category"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard
              image="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80"
              title="Electronics"
              subtitle="Latest gadgets & gear"
              link="/products?category=Electronics"
              color="#1E3A8A"
            />
            <CategoryCard
              image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"
              title="Fashion"
              subtitle="Trending styles"
              link="/products?category=Clothing"
              color="#7C3AED"
            />
            <CategoryCard
              image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80"
              title="Home & Living"
              subtitle="Design your space"
              link="/products?category=Home & Kitchen"
              color="#0891B2"
            />
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-[#1E3A8A] rounded-2xl px-8 md:px-16 py-12 md:py-16">
            {/* Pattern */}
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <span className="inline-block bg-[#F97316] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg mb-4">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Up to 40% Off This Week
                </h2>
                <p className="text-white/70 text-base max-w-md">
                  Don't miss our biggest sale of the season. Premium products at unbeatable prices.
                </p>
              </div>
              <Link to="/products">
                <button className="h-12 px-8 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-base font-semibold shadow-lg shadow-orange-500/20 transition-all duration-200 flex items-center gap-2 whitespace-nowrap active:scale-[0.98]">
                  Shop the Sale
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Just In"
            title="New Arrivals"
            link="/products?sort=newest"
            linkText="See More"
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.length > 0 ? (
                newArrivals.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product._id + '-new'} product={product} />
                ))
              ) : (
                <EmptyState message="No new arrivals yet" />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard
              icon={<Truck className="h-6 w-6 text-[#1E3A8A]" />}
              title="Free Shipping"
              desc="On orders above ₹499"
            />
            <BenefitCard
              icon={<ShieldCheck className="h-6 w-6 text-[#1E3A8A]" />}
              title="Secure Payment"
              desc="100% protected transactions"
            />
            <BenefitCard
              icon={<Package className="h-6 w-6 text-[#1E3A8A]" />}
              title="Easy Returns"
              desc="30-day return policy"
            />
            <BenefitCard
              icon={<Headphones className="h-6 w-6 text-[#1E3A8A]" />}
              title="24/7 Support"
              desc="Dedicated help center"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

/* -------- Reusable Components -------- */

const SectionHeader = ({ label, title, link, linkText }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
    <div>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F97316] mb-2 block">
        {label}
      </span>
      <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {title}
      </h2>
    </div>
    {link && (
      <Link to={link} className="text-sm font-semibold text-[#2563EB] hover:text-[#1E3A8A] flex items-center gap-1 transition-colors group">
        {linkText}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    )}
  </div>
)

const CategoryCard = ({ image, title, subtitle, link, color }) => (
  <Link to={link} className="group relative overflow-hidden rounded-2xl h-[340px] block">
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {title}
      </h3>
      <p className="text-white/70 text-sm mb-4">{subtitle}</p>
      <span className="inline-flex items-center gap-1.5 text-white text-sm font-semibold bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 group-hover:bg-[#F97316] group-hover:border-[#F97316] transition-all duration-300">
        Shop Now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </div>
  </Link>
)

const BenefitCard = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-md transition-all duration-200">
    <div className="h-12 w-12 shrink-0 bg-blue-50 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="text-[15px] font-semibold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {title}
      </h4>
      <p className="text-sm text-[#6B7280] mt-0.5">{desc}</p>
    </div>
  </div>
)

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
    <div className="aspect-square bg-gray-100 animate-pulse"></div>
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-100 animate-pulse rounded w-16"></div>
      <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4"></div>
      <div className="h-3 bg-gray-100 animate-pulse rounded w-20"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gray-100 animate-pulse rounded w-16"></div>
        <div className="h-9 w-9 bg-gray-100 animate-pulse rounded-xl"></div>
      </div>
    </div>
  </div>
)

const EmptyState = ({ message }) => (
  <div className="col-span-full text-center py-16 bg-white rounded-xl border-2 border-dashed border-[#E5E7EB]">
    <Package className="h-10 w-10 mx-auto text-[#9CA3AF] mb-3" />
    <p className="text-[#6B7280] font-medium">{message}</p>
  </div>
)

export default Home
