import React from 'react'
import { Button } from './components/ui/button.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/ui/navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Verify from './pages/Verify.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Profile from './pages/Profile.jsx'
import Orders from './pages/Orders.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Wishlist from './pages/Wishlist.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'


const PageLayout = ({ children, hasPadding = true }) => (
  <div className="flex flex-col min-h-screen">
    <ScrollToTop />
    <Navbar />
    <main className={`flex-grow ${hasPadding ? 'pt-20' : ''}`}>
      {children}
    </main>
    <Footer />
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout hasPadding={false}><Home /></PageLayout>
  },
  {
    path: '/signup',
    element: <><Signup /></>
  },
  {
    path: '/login',
    element: <><Login /></>
  },
  {
    path: '/verify/:token',
    element: <><Verify /></>
  },
  {
    path: '/products',
    element: <PageLayout><Products /></PageLayout>
  },
  {
    path: '/product/:id',
    element: <PageLayout><ProductDetail /></PageLayout>
  },
  {
    path: '/cart',
    element: <ProtectedRoute><PageLayout><Cart /></PageLayout></ProtectedRoute>
  },
  {
    path: '/checkout',
    element: <ProtectedRoute><PageLayout><Checkout /></PageLayout></ProtectedRoute>
  },
  {
    path: '/profile',
    element: <ProtectedRoute><PageLayout><Profile /></PageLayout></ProtectedRoute>
  },
  {
    path: '/orders',
    element: <ProtectedRoute><PageLayout><Orders /></PageLayout></ProtectedRoute>
  },
  {
    path: '/admin',
    element: <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
  },
  {
    path: '/admin-login',
    element: <AdminLogin />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />
  },
  {
    path: '/wishlist',
    element: <ProtectedRoute><PageLayout><Wishlist /></PageLayout></ProtectedRoute>
  },

])

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
