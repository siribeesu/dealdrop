import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import {
  Trash2, Edit, Plus, LogOut, Users, Package, ShoppingCart,
  IndianRupee, BarChart3, Search, LayoutDashboard, ShoppingBag,
  Settings, ImagePlus, ChevronRight, X, Loader2, ArrowUpRight, TrendingUp,
  Upload, User, ExternalLink, Calendar, CheckCircle, ShieldCheck, Activity,
  Database, Bell, Filter, MoreVertical, Eye, Download, PieChart, MessageSquare,
  ArrowRight
} from 'lucide-react'
import { adminAPI, productsAPI } from '../lib/api.js'
import Logo from '../components/ui/Logo.jsx'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, logout, user: authUser, loading: authLoading } = useAuth()
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0
  })
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', images: [''], description: '', category: '', stock: ''
  })

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) navigate('/admin-login')
      else if (!isAdmin) navigate('/login')
      else fetchDashboardData()
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch stats
      try {
        const stats = await adminAPI.getDashboardStats()
        if (stats.success) setDashboardStats(stats.stats)
      } catch (e) { console.error('❌ Stats fetch failed:', e) }

      // Fetch products
      try {
        const prod = await productsAPI.getProducts({ limit: 100 })
        if (prod.success) setProducts(prod.products || [])
      } catch (e) { console.error('❌ Products fetch failed:', e) }

      // Fetch orders
      try {
        const ord = await adminAPI.getOrders({ limit: 100 })
        if (ord.success) setOrders(ord.orders || [])
      } catch (e) { console.error('❌ Orders fetch failed:', e) }

      // Fetch users
      try {
        const usr = await adminAPI.getUsers({ limit: 100 })
        if (usr.success) setUsers(usr.users || [])
      } catch (e) { console.error('❌ Users fetch failed:', e) }

    } catch (error) {
      console.error('💥 Dashboard data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (editingProduct) setEditingProduct({ ...editingProduct, [name]: value })
    else setNewProduct({ ...newProduct, [name]: value })
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploading(true)
    try {
      for (const file of files) {
        const response = await productsAPI.uploadImage(file)
        if (response.success) {
          const url = response.url
          if (editingProduct) {
            const currentImgs = editingProduct.images?.map(img => typeof img === 'string' ? img : (img.url || '')) || []
            setEditingProduct({ ...editingProduct, images: currentImgs[0] === '' ? [url] : [...currentImgs, url] })
          } else {
            const currentImgs = newProduct.images || ['']
            setNewProduct({ ...newProduct, images: currentImgs[0] === '' ? [url] : [...currentImgs, url] })
          }
        }
      }
    } catch (err) { alert('Upload failed') } finally { setUploading(false); e.target.value = '' }
  }

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault()
    const data = editingProduct || newProduct

    // Clean data before sending
    const productData = {
      name: data.name,
      price: parseFloat(data.price) || 0,
      description: data.description,
      category: data.category,
      stock: parseInt(data.stock) || 0,
      images: (data.images || []).filter(img => typeof img === 'string' && img.trim() !== ''),
      brand: data.brand || '',
      subcategory: data.subcategory || '',
      onSale: data.onSale || false,
      discountPercentage: parseFloat(data.discountPercentage) || 0
    }

    try {
      const resp = editingProduct
        ? await productsAPI.updateProduct(editingProduct._id, productData)
        : await productsAPI.createProduct(productData)

      if (resp.success) {
        await fetchDashboardData()
        setShowAddForm(false)
        setEditingProduct(null)
        setNewProduct({ name: '', price: '', images: [''], description: '', category: '', stock: '' })
      } else {
        alert(resp.message || 'Operation failed')
      }
    } catch (err) {
      console.error('Operation error:', err)
      alert(err.data?.message || err.message || 'Operation failed')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(id)
        fetchDashboardData()
      } catch (err) { alert('Delete failed') }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 border-4 border-slate-200 border-t-[#1E3A8A] rounded-full animate-spin"></div>
      <p className="text-[#6B7280] font-medium text-sm">Loading Management System...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#1E3A8A] text-white z-[60] shadow-xl">
        <div className="flex flex-col h-full">
          <div className="p-6 mb-4">
            <Logo dark={true} />
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-2 block">Admin Console v1.0</p>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            <SidebarItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarItem active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingCart size={20} />} label="Orders" />
            <SidebarItem active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package size={20} />} label="Products" />
            <SidebarItem active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={<Users size={20} />} label="Customers" />
            <SidebarItem active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<PieChart size={20} />} label="Analytics" />
            <SidebarItem active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={<MessageSquare size={20} />} label="Messages" />
            <SidebarItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="Settings" />
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => { logout(); navigate('/') }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[240px] min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 right-0 z-40 bg-white border-b border-[#E5E7EB] px-8 h-16 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-bold tracking-tight capitalize" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {activeTab}
          </h2>

          <div className="flex-1 max-w-md px-10">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search command..."
                className="w-full h-10 pl-11 pr-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/10 focus:border-[#1E3A8A] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-[#6B7280] hover:text-[#1F2937] transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#F97316] rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-[#E5E7EB]"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold leading-none mb-1">{authUser?.firstName}</p>
                <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] font-bold shadow-inner">
                {authUser?.firstName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Viewport content */}
        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardOverview stats={dashboardStats} orders={orders} products={products} />}
          {activeTab === 'orders' && <OrdersManager orders={orders} onDetails={setSelectedOrder} />}
          {activeTab === 'products' && (
            <ProductsManager
              products={products}
              onEdit={(p) => {
                setEditingProduct({
                  ...p,
                  stock: p.inventory?.quantity || 0,
                  images: p.images?.map(img => typeof img === 'string' ? img : img.url) || []
                });
                setShowAddForm(true);
              }}
              onDelete={handleDeleteProduct}
              onAdd={() => { setEditingProduct(null); setShowAddForm(true); }}
            />
          )}
          {activeTab === 'customers' && <CustomersManager users={users} onDetails={setSelectedUser} />}
          {['analytics', 'messages', 'settings'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div className="h-16 w-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <Settings size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 capitalize">Module coming soon</h3>
              <p className="text-slate-500 text-sm">We're working on the {activeTab} analytics.</p>
            </div>
          )}
        </div>
      </main>

      {/* Side Drawer for Order Details */}
      {selectedOrder && (
        <SideDrawer title={`Order Details #${selectedOrder._id.slice(-6).toUpperCase()}`} onClose={() => setSelectedOrder(null)}>
          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status</p>
                <StatusBadge status={selectedOrder.orderStatus} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Order Date</p>
                <p className="text-sm font-bold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Customer Details</h4>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {selectedOrder.user?.firstName?.[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.user?.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Shipping Information</h4>
              <div className="p-4 border border-slate-100 rounded-xl space-y-2">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedOrder.shippingAddress?.address}<br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                  {selectedOrder.shippingAddress?.zipCode}, {selectedOrder.shippingAddress?.country}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 border border-slate-50 rounded-xl hover:bg-slate-50 transition-colors">
                    <img src={item.product?.images?.[0]?.url || item.product?.images?.[0]} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{item.product?.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                    <p className="font-bold text-slate-900">₹{item.quantity * item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">Total Valuation</p>
              <p className="text-2xl font-black text-[#1E3A8A]">₹{selectedOrder.total.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="h-11 rounded-xl bg-[#F8FAFC] text-slate-700 font-bold text-xs border border-[#E5E7EB] hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                <Download size={16} /> Invoice
              </button>
              <button className="h-11 rounded-xl bg-[#1E3A8A] text-white font-bold text-xs hover:bg-[#1e40af] transition-all flex items-center justify-center gap-2">
                Ship Order
              </button>
            </div>
          </div>
        </SideDrawer>
      )}

      {/* Side Drawer for User Profile */}
      {selectedUser && (
        <SideDrawer title="Customer Profile" onClose={() => setSelectedUser(null)}>
          <div className="flex flex-col items-center text-center pb-8 border-b border-slate-100">
            <div className="h-24 w-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1E3A8A] text-2xl font-black mb-4 shadow-inner">
              {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">{selectedUser.email}</p>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${selectedUser.isVerified ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                {selectedUser.isVerified ? 'Verified' : 'Unverified'}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-[#1E3A8A] border border-blue-100">
                {selectedUser.role}
              </span>
            </div>
          </div>

          <div className="py-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Join Date</p>
                <p className="text-sm font-bold text-slate-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Activity</p>
                <p className="text-sm font-bold text-slate-900">Active</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Account Metadata</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Citizen ID</span>
                  <span className="font-mono text-slate-700 text-xs">{selectedUser._id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Email Preference</span>
                  <span className="text-slate-900 font-medium underline">Opt-in</span>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full h-11 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all text-xs">
            Deactivate Account
          </button>
        </SideDrawer>
      )}

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[1.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="px-8 py-6 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct ? editingProduct.name : newProduct.name}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 outline-none font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 outline-none font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Inventory Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct ? (editingProduct.stock ?? editingProduct.inventory?.quantity ?? 0) : newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 outline-none font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editingProduct ? editingProduct.category : newProduct.category}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 outline-none font-medium"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Image Assets</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 h-12 px-4 bg-[#F8FAFC] border border-dashed border-[#E5E7EB] rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all text-xs font-bold text-slate-500">
                      <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Image'}
                      <input type="file" multiple onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {(editingProduct ? editingProduct.images : newProduct.images)?.map((img, i) => (
                      <div key={i} className="h-16 w-16 rounded-lg border border-slate-100 overflow-hidden shrink-0">
                        <img src={img} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editingProduct ? editingProduct.description : newProduct.description}
                    onChange={handleInputChange}
                    className="w-full h-32 p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 outline-none font-medium text-sm resize-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 h-12 rounded-xl border border-[#E5E7EB] text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-[2] h-12 bg-[#F97316] text-white rounded-xl font-bold hover:bg-[#EA580C] shadow-lg shadow-[#F97316]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : (editingProduct ? 'Save Changes' : 'Publish Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const SidebarItem = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all relative font-medium group ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
  >
    {active && <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#F97316] rounded-r-full"></div>}
    <span className={`${active ? 'text-white' : 'text-white/60 group-hover:text-white'} transition-colors`}>{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
)

const SideDrawer = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[70] flex justify-end">
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
    <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {children}
      </div>
    </div>
  </div>
)

const DashboardOverview = ({ stats, orders, products }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<IndianRupee />} trend="+12.5%" />
      <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart />} trend="+4.3%" />
      <StatCard title="Active Users" value={stats.totalUsers} icon={<Users />} trend="+8.1%" />
      <StatCard title="Products" value={stats.totalProducts} icon={<Package />} trend="Operational" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sales Overview</h3>
          <select className="bg-slate-50 border-none text-[10px] font-bold py-1 rounded-lg outline-none">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
          </select>
        </div>
        <div className="h-64 bg-slate-50 rounded-xl flex items-end justify-between px-8 py-4 gap-2">
          {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60, 85, 55].map((h, i) => (
            <div key={i} className="w-full bg-[#1E3A8A]/10 rounded-t-lg relative group transition-all hover:bg-[#1E3A8A]/30" style={{ height: `${h}%` }}>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1E3A8A] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{h * 100}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Orders Analytics</h3>
          <MoreVertical size={16} className="text-slate-400" />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="relative h-48 w-48 rounded-full border-[16px] border-[#1E3A8A]/10 flex items-center justify-center">
            <div className="absolute inset-[-16px] rounded-full border-[16px] border-[#1E3A8A] border-t-transparent border-r-transparent rotate-45"></div>
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900 leading-none">{stats.totalOrders}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-3 rounded-xl bg-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Pending</p>
            <p className="text-sm font-black text-amber-500">22%</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Success</p>
            <p className="text-sm font-black text-[#16A34A]">68%</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Failed</p>
            <p className="text-sm font-black text-red-500">10%</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h3>
        <button className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1 hover:underline">View All <ArrowRight size={14} /></button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {orders.slice(0, 5).map((o, i) => (
              <tr key={i} className={`hover:bg-slate-50 transition-colors ${i % 2 === 1 ? 'bg-[#F8FAFC]/50' : ''}`}>
                <td className="px-6 py-4 text-xs font-mono font-bold text-[#1E3A8A]">#{o._id.slice(-6).toUpperCase()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black">{o.user?.firstName?.[0]}</div>
                    <span className="text-xs font-bold text-slate-700">{o.user?.firstName} {o.user?.lastName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-[#6B7280] font-medium">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-900">₹{o.total.toLocaleString()}</td>
                <td className="px-6 py-4"><StatusBadge status={o.orderStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-[12px] border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-[#1F2937] tracking-tight">{value}</h3>
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trend.startsWith('+') ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-slate-100 text-[#6B7280]'}`}>{trend}</span>
          <span className="text-[10px] text-[#9CA3AF] font-medium">from last cycle</span>
        </div>
      </div>
      <div className="h-12 w-12 rounded-xl bg-slate-50 text-[#1E3A8A] flex items-center justify-center shadow-inner group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
        {icon}
      </div>
    </div>
  </div>
)

const ProductsManager = ({ products, onEdit, onDelete, onAdd }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input type="text" placeholder="Filter inventory..." className="w-full h-11 pl-11 pr-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm outline-none focus:border-[#1E3A8A] transition-all" />
        </div>
        <button className="h-11 px-4 bg-slate-50 border border-[#E5E7EB] rounded-xl flex items-center gap-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
          <Filter size={16} /> Filters
        </button>
      </div>
      <button onClick={onAdd} className="h-11 px-6 bg-[#F97316] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#F97316]/20 transition-all hover:bg-[#EA580C] active:scale-95 flex items-center gap-2">
        <Plus size={18} /> Add Product
      </button>
    </div>

    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-8 py-5">Product Information</th>
              <th className="px-8 py-5">Classification</th>
              <th className="px-8 py-5">Price</th>
              <th className="px-8 py-5">Stock_Lv</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {products.map((p, i) => (
              <tr key={i} className={`hover:bg-slate-50 transition-colors ${i % 2 === 1 ? 'bg-[#F8FAFC]/50' : ''}`}>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img src={p.images?.[0]?.url || p.images?.[0] || p.image} className="h-12 w-12 rounded-xl object-cover border border-slate-100" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{p.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">ID::{p._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">{p.category}</span>
                </td>
                <td className="px-8 py-5 text-sm font-bold">₹{p.price.toLocaleString()}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${(p.inventory?.quantity || 0) < 10 ? 'bg-[#DC2626]' : 'bg-[#16A34A]'}`} style={{ width: `${Math.min((p.inventory?.quantity || 0) * 10, 100)}%` }}></div>
                    </div>
                    <span className={`text-[11px] font-bold ${(p.inventory?.quantity || 0) < 10 ? 'text-[#DC2626]' : 'text-slate-500'}`}>{p.inventory?.quantity || 0}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${(p.inventory?.quantity || 0) > 0 ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`}></div>
                    <span className={`text-[10px] font-bold uppercase ${(p.inventory?.quantity || 0) > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{(p.inventory?.quantity || 0) > 0 ? 'Active' : 'Out of Stock'}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right space-x-2">
                  <button onClick={() => onEdit(p)} className="p-2.5 text-[#1E3A8A] hover:bg-[#1E3A8A]/5 border border-[#1E3A8A]/20 rounded-xl transition-all"><Edit size={16} /></button>
                  <button onClick={() => onDelete(p._id)} className="p-2.5 text-[#DC2626] hover:bg-[#DC2626]/5 rounded-xl transition-all"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-4 border-t border-[#E5E7EB] bg-[#F8FAFC]/30 flex items-center justify-between">
        <p className="text-xs text-[#9CA3AF] font-medium font-sans">Showing 1-10 of {products.length} products</p>
        <div className="flex gap-2">
          <button className="h-8 w-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-white transition-all"><ChevronRight size={16} className="rotate-180" /></button>
          <button className="h-8 w-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-white transition-all"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  </div>
)

const OrdersManager = ({ orders, onDetails }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center"><ShoppingCart size={24} /></div>
        <div>
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest leading-none mb-1">Incoming</p>
          <p className="text-xl font-black text-slate-900">42 Orders</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] flex items-center gap-4 border-l-4 border-l-[#F97316]">
        <div className="h-12 w-12 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center"><Activity size={24} /></div>
        <div>
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest leading-none mb-1">Pending Sync</p>
          <p className="text-xl font-black text-slate-900">12 Required</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-green-50 text-[#16A34A] flex items-center justify-center"><CheckCircle size={24} /></div>
        <div>
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest leading-none mb-1">Fulfilled</p>
          <p className="text-xl font-black text-slate-900">88.5% Success</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
      <div className="px-8 py-5 bg-white border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input type="text" placeholder="Search Order ID..." className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-[#1E3A8A]" />
          </div>
          <button className="h-9 px-4 bg-white border border-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Filter size={14} /> Status
          </button>
          <button className="h-9 px-4 bg-white border border-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Calendar size={14} /> Date Range
          </button>
        </div>
        <button className="h-9 px-4 bg-[#1E3A8A] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#1e40af] transition-all flex items-center gap-2">
          <Download size={14} /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-8 py-5">Order Reference</th>
              <th className="px-8 py-5">Customer Node</th>
              <th className="px-8 py-5">Items_Vol</th>
              <th className="px-8 py-5">Valuation</th>
              <th className="px-8 py-5">Sync Status</th>
              <th className="px-8 py-5 text-right">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {orders.map((o, i) => (
              <tr key={i} onClick={() => onDetails(o)} className={`hover:bg-slate-50 transition-all cursor-pointer group ${i % 2 === 1 ? 'bg-[#F8FAFC]/40' : ''}`}>
                <td className="px-8 py-5">
                  <span className="text-xs font-mono font-black text-[#1E3A8A] bg-blue-50 px-2 py-1 rounded">#{o._id.slice(-6).toUpperCase()}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black">{o.user?.firstName?.[0]}</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-none mb-1">{o.user?.firstName} {o.user?.lastName}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{o.user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-xs text-slate-600 font-medium">{o.items?.length || 0} Assets</td>
                <td className="px-8 py-5 font-bold text-slate-900 text-xs">₹{o.total.toLocaleString()}</td>
                <td className="px-8 py-5"><StatusBadge status={o.orderStatus} /></td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2 text-slate-400 group-hover:text-[#1E3A8A] transition-colors"><Eye size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-4 border-t border-[#E5E7EB] bg-[#F8FAFC]/30 flex items-center justify-end">
        <div className="flex gap-2">
          <button className="h-8 px-3 rounded-lg border border-[#E5E7EB] text-[10px] font-bold text-slate-400 bg-white">Prev</button>
          <button className="h-8 w-8 rounded-lg bg-[#1E3A8A] text-white text-[10px] font-bold">1</button>
          <button className="h-8 w-8 rounded-lg border border-[#E5E7EB] text-[10px] font-bold text-slate-600 hover:bg-white transition-all">2</button>
          <button className="h-8 px-3 rounded-lg border border-[#E5E7EB] text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all">Next</button>
        </div>
      </div>
    </div>
  </div>
)

const CustomersManager = ({ users, onDetails }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="flex items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
      <div className="relative w-96 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" placeholder="Search Citizen Database..." className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1E3A8A] transition-all text-sm font-medium" />
      </div>
      <div className="flex items-center gap-3">
        <button className="h-11 px-5 bg-white border border-[#E5E7EB] rounded-xl flex items-center gap-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest">
          <Download size={16} /> Registry Export
        </button>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans">
          <thead className="bg-[#F8FAFC] text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-10 py-6">Citizen Profile</th>
              <th className="px-10 py-6">Credentials_Node</th>
              <th className="px-10 py-6">Account Type</th>
              <th className="px-10 py-6">Lifecycle Status</th>
              <th className="px-10 py-6">Registry Date</th>
              <th className="px-10 py-6 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {users.map((u, i) => (
              <tr key={i} className={`hover:bg-slate-50 transition-all cursor-pointer ${i % 2 === 1 ? 'bg-[#F8FAFC]/50' : ''}`}>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-[#1E3A8A]/5 flex items-center justify-center text-[#1E3A8A] font-black border border-[#1E3A8A]/10 shadow-inner">
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none mb-1">{u.firstName} {u.lastName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Verified Citizen</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6 text-xs text-slate-600 font-medium italic lowercase">{u.email}</td>
                <td className="px-10 py-6">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-[#1E3A8A]/5 text-[#1E3A8A] border border-[#1E3A8A]/10'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${u.isVerified ? 'bg-[#16A34A]' : 'bg-[#DC2626]'} animate-pulse`}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${u.isVerified ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{u.isVerified ? 'Synchronized' : 'Desynced'}</span>
                  </div>
                </td>
                <td className="px-10 py-6 text-xs text-slate-500 font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-10 py-6 text-right">
                  <button onClick={() => onDetails(u)} className="p-2 text-slate-400 hover:text-[#1E3A8A] transition-colors"><User size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

const StatusBadge = ({ status }) => {
  const styles = {
    delivered: 'bg-green-50 text-[#16A34A] border-green-100',
    shipped: 'bg-blue-50 text-[#1E3A8A] border-blue-100',
    pending: 'bg-orange-50 text-[#F97316] border-orange-100',
    cancelled: 'bg-red-50 text-[#DC2626] border-red-100',
    confirmed: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    processing: 'bg-amber-50 text-amber-600 border-amber-100',
  }
  const current = styles[status?.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-100'
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${current}`}>
      {status}
    </span>
  )
}

export default AdminDashboard
