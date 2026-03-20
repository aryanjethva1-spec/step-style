import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layout Components (always needed, load eagerly)
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages loaded on demand (lazy)
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Auth = lazy(() => import('./pages/Auth'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const BrandLogin = lazy(() => import('./pages/BrandLogin'));
const Profile = lazy(() => import('./pages/Profile'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

// Dashboards loaded on demand (lazy)
const UserDashboard = lazy(() => import('./dashboards/UserDashboard'));
const BrandDashboard = lazy(() => import('./dashboards/BrandDashboard'));
const BrandProducts = lazy(() => import('./dashboards/BrandProducts'));
const AddProduct = lazy(() => import('./dashboards/AddProduct'));
const BrandOrders = lazy(() => import('./dashboards/BrandOrders'));
const BrandEditProfile = lazy(() => import('./pages/BrandEditProfile'));
const BrandChangePassword = lazy(() => import('./pages/BrandChangePassword'));
const AdminDashboard = lazy(() => import('./dashboards/AdminDashboard'));
const AdminUsers = lazy(() => import('./dashboards/AdminUsers'));
const AdminBrands = lazy(() => import('./dashboards/AdminBrands'));
const AdminOrders = lazy(() => import('./dashboards/AdminOrders'));
const AdminChangePassword = lazy(() => import('./dashboards/AdminChangePassword'));
const AdminProducts = lazy(() => import('./dashboards/AdminProducts'));
const AdminReviews = lazy(() => import('./dashboards/AdminReviews'));
const BrandApprovals = lazy(() => import('./dashboards/BrandApprovals'));

// Loading spinner for Suspense fallback
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
    <div className="spinner-border text-danger" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100 bg-light">
              <Navbar />
              <main className="flex-grow-1">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/register" element={<Auth />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/myorders" element={<UserDashboard />} />
                    <Route path="/brand/login" element={<BrandLogin />} />
                    <Route path="/brand/dashboard" element={<BrandDashboard />} />
                    <Route path="/brand/products" element={<BrandProducts />} />
                    <Route path="/brand/add-product" element={<AddProduct />} />
                    <Route path="/brand/edit-product/:id" element={<AddProduct />} />
                    <Route path="/brand/orders" element={<BrandOrders />} />
                    <Route path="/brand/edit-profile" element={<BrandEditProfile />} />
                    <Route path="/brand/change-password" element={<BrandChangePassword />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/brands" element={<AdminBrands />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/change-password" element={<AdminChangePassword />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/reviews" element={<AdminReviews />} />
                    <Route path="/admin/approvals" element={<BrandApprovals />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
