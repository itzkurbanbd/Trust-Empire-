'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/home/HeroSlider';
import BrandMotion from '@/components/home/BrandMotion';
import CategoryMotion from '@/components/home/CategoryMotion';
import OfferSlider from '@/components/home/OfferSlider';
import CategorySection from '@/components/home/CategorySection';
import ProductGrid from '@/components/products/ProductGrid';
import ProductDetail from '@/components/products/ProductDetail';
import RepairSection from '@/components/repair/RepairSection';
import AccountSection from '@/components/account/AccountSection';
import CartDrawer from '@/components/drawers/CartDrawer';
import PaymentDrawer from '@/components/drawers/PaymentDrawer';
import WishlistDrawer from '@/components/drawers/WishlistDrawer';
import NotificationDrawer from '@/components/drawers/NotificationDrawer';
import AccountModal from '@/components/modals/AccountModal';
import OrderSummaryModal from '@/components/modals/OrderSummaryModal';
import AdminPanel from '@/components/admin/AdminPanel';

// Hooks
import { useFlashProducts, useLatestProducts, useFeaturedProducts, useSliders } from '@/hooks/useFirebaseData';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

// Context Providers
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const { products: flashProducts, loading: flashLoading } = useFlashProducts();
  const { products: latestProducts, loading: latestLoading } = useLatestProducts();
  const { products: featuredProducts, loading: featuredLoading } = useFeaturedProducts();
  const { sliders } = useSliders();
  const { user } = useAuth();
  const { cartItems } = useCart();

  const handleProductClick = (productId) => {
    setSelectedProduct(productId);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  const handleSlideClick = (slider) => {
    if (slider.link) {
      window.location.href = slider.link;
    } else if (slider.offerPackage) {
      // Open offer package popup
      console.log('Open offer package:', slider.offerPackage);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-100 min-h-screen">
      <Header
        onCartClick={() => setShowCart(true)}
        onWishlistClick={() => setShowWishlist(true)}
        onNotificationsClick={() => setShowNotifications(true)}
        onAccountClick={() => user ? setActiveSection('account') : setShowAccountModal(true)}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />
      
      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeSection === 'home' && !selectedProduct && (
          <div key="home" className="pb-20">
            <HeroSlider sliders={sliders} onSlideClick={handleSlideClick} />
            <BrandMotion />
            <CategoryMotion />
            <OfferSlider />
            
            <ProductGrid
              title="🔥 Flash Sell"
              products={flashProducts}
              loading={flashLoading}
              onProductClick={handleProductClick}
              seeMoreLink="#"
            />
            
            <CategorySection />
            
            <ProductGrid
              title="✨ Latest products"
              products={latestProducts}
              loading={latestLoading}
              onProductClick={handleProductClick}
              seeMoreLink="#"
            />
            
            <OfferSlider variant="second" />
            
            <ProductGrid
              title="🚀 Future products"
              products={featuredProducts}
              loading={featuredLoading}
              onProductClick={handleProductClick}
              seeMoreLink="#"
            />
            
            <ProductGrid
              title="❤️ More to love"
              products={featuredProducts}
              loading={featuredLoading}
              onProductClick={handleProductClick}
              seeMoreLink="#"
            />
          </div>
        )}
        
        {activeSection === 'repair' && !selectedProduct && (
          <RepairSection key="repair" />
        )}
        
        {activeSection === 'account' && !selectedProduct && (
          <AccountSection key="account" />
        )}
      </AnimatePresence>
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          productId={selectedProduct}
          onClose={handleCloseDetail}
        />
      )}
      
      {/* Drawers */}
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
      <PaymentDrawer isOpen={showPayment} onClose={() => setShowPayment(false)} />
      <WishlistDrawer isOpen={showWishlist} onClose={() => setShowWishlist(false)} />
      <NotificationDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      
      {/* Modals */}
      <AccountModal isOpen={showAccountModal} onClose={() => setShowAccountModal(false)} />
      <OrderSummaryModal isOpen={showOrderSummary} onClose={() => setShowOrderSummary(false)} />
      
      {/* Admin Panel */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      
      {/* Bottom Navigation */}
      <BottomNav
        active={activeSection}
        onChange={setActiveSection}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <HomePage />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}