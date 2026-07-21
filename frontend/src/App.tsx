import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import FavoritesDrawer from './components/FavoritesDrawer';
import ProfileDrawer from './components/ProfileDrawer';
import Footer from './components/Footer';
import { fetchProducts } from './api';

import { Product } from './types';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPageWrapper from './pages/ProductDetailsPageWrapper';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import AiShoppingPage from './pages/AiShoppingPage';

import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';
import { useFilters } from './hooks/useFilters';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // --- UI Overlays drawers visibility ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotification, setShowNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [isInformationOpen, setIsInformationOpen] = useState(false);

  // --- Sync storage full catalog once for filters Choice ---
  const [allProductsForFilters, setAllProductsForFilters] = useState<Product[]>([]);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  // --- Product Details States ---
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);

  // --- Derived Routing path location ---
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = React.useMemo(() => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path === '/collections') return 'collections';
    if (path === '/men') return 'men';
    if (path === '/women') return 'women';
    if (path === '/accessories') return 'accessories';
    if (path.startsWith('/product/')) return 'product-details';
    if (path === '/login') return 'login';
    if (path === '/signup') return 'signup';
    if (path === '/admin') return 'admin';
    if (path === '/ai-shopping') return 'ai-shopping';
    return 'home';
  }, [location.pathname]);

  const setCurrentPage = (page: string) => {
    if (page === 'home') navigate('/');
    else if (page === 'product-details') {
      if (selectedProductForDetails) navigate(`/product/${selectedProductForDetails.id}`);
      else navigate('/');
    } else navigate(`/${page}`);
  };

  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 3500);
  };

  // --- Hooks integrations ---
  const {
    authToken,
    userProfile,
    setUserProfile,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginError,
    setLoginError,
    isLoggingIn,
    signupName,
    setSignupName,
    signupEmail,
    setSignupEmail,
    signupPassword,
    setSignupPassword,
    signupConfirmPassword,
    setSignupConfirmPassword,
    signupIsSeller,
    setSignupIsSeller,
    signupError,
    setSignupError,
    isSigningUp,
    handleLoginSubmit,
    handleSignupSubmit,
    handleLogout,
  } = useAuth(triggerNotification, setCurrentPage);

  const {
    cartItems,
    favoriteItems,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveCartItem,
    handleClearCart,
    handleFavoriteToggle,
    handleAddOrder,
  } = useCart(triggerNotification, setUserProfile);

  const {
    selectedCategories,
    setSelectedCategories,
    priceRangeMax,
    setPriceRangeMax,
    selectedSizes,
    setSelectedSizes,
    selectedColors,
    setSelectedColors,
    minRating,
    setMinRating,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    handleCategoryToggle,
    handleSizeToggle,
    handleColorToggle,
    handleClearAllFilters,
    uniqueCategories,
    uniqueColors,
  } = useFilters(allProductsForFilters);

  // Load all products for choices
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const fullList = await fetchProducts(1, 1000);
        setAllProductsForFilters(fullList);
      } catch (error) {
        console.warn('Unable to load catalog choices', error);
      }
    };
    loadAllProducts();
  }, []);

  // Fetch paginated active subset of products
  useEffect(() => {
    const loadPaginatedProducts = async () => {
      try {
        setIsLoadingProducts(true);
        let genderParam: string | undefined = undefined;
        if (currentPage === 'men') genderParam = 'Men';
        else if (currentPage === 'women') genderParam = 'Women';
        
        let categoryParam: string | undefined = undefined;
        if (currentPage === 'accessories') {
          categoryParam = selectedCategories.length > 0 ? selectedCategories.join(',') : 'Accessories,Eyewear,Bags';
        } else if (selectedCategories.length > 0) {
          categoryParam = selectedCategories.join(',');
        }

        const limit = 10;
        const fetched = await fetchProducts(currentPageNum, limit, categoryParam, searchQuery, genderParam);
        
        setProducts(fetched);
        setHasMoreProducts(fetched.length === limit);
      } catch (error) {
        setProductsError(error instanceof Error ? error.message : 'Unable to load products');
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadPaginatedProducts();
  }, [currentPage, currentPageNum, selectedCategories, searchQuery]);

  // Reset page number on filters update
  useEffect(() => {
    setCurrentPageNum(1);
  }, [currentPage, searchQuery, selectedCategories, priceRangeMax, selectedSizes, selectedColors, minRating]);

  // --- Scrolling helper ---
  const handleScrollToNewArrivals = () => {
    const el = document.getElementById('new-arrivals-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredPageProducts = React.useMemo(() => {
    let list = [...products];
    if (priceRangeMax < 1500) list = list.filter((p) => p.price <= priceRangeMax);
    if (selectedSizes.length > 0) list = list.filter((p) => p.sizes?.some((s) => selectedSizes.includes(s)));
    if (selectedColors.length > 0) list = list.filter((p) => p.colors?.some((c) => selectedColors.includes(c.name)));
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);

    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, priceRangeMax, selectedSizes, selectedColors, minRating, sortBy]);

  const newArrivalsProducts = React.useMemo(() => {
    return allProductsForFilters.filter((p) => p.isNew).slice(0, 4);
  }, [allProductsForFilters]);

  const cartTotalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isAdminPage = currentPage === 'admin';

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-black relative">
      {!isAdminPage && (
        <Header
          onCartToggle={() => setIsCartOpen(true)}
          onFavoritesToggle={() => setIsFavoritesOpen(true)}
          onProfileToggle={() => setIsProfileOpen(true)}
          cartCount={cartTotalItemsCount}
          favoritesCount={favoriteItems.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onScrollToNewArrivals={handleScrollToNewArrivals}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoggedIn={!!authToken}
        />
      )}

      <main className={isAdminPage ? 'pt-0' : 'pt-20'}>
        <Routes>
          <Route path="/" element={
            <HomePage
              newArrivalsProducts={newArrivalsProducts}
              isLoadingProducts={isLoadingProducts}
              productsError={productsError}
              favoriteItems={favoriteItems}
              handleFavoriteToggle={handleFavoriteToggle}
              onProductClick={(p) => {
                setSelectedProductForDetails(p);
                navigate(`/product/${p.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddToCart={handleAddToCart}
              handleScrollToNewArrivals={handleScrollToNewArrivals}
              setCurrentPage={setCurrentPage}
            />
          } />
          
          <Route path="/login" element={
            <LoginPage
              loginEmail={loginEmail}
              setLoginEmail={setLoginEmail}
              loginPassword={loginPassword}
              setLoginPassword={setLoginPassword}
              loginError={loginError}
              setLoginError={setLoginError}
              isLoggingIn={isLoggingIn}
              handleLoginSubmit={handleLoginSubmit}
              setSignupError={setSignupError}
              setCurrentPage={setCurrentPage}
            />
          } />

          <Route path="/signup" element={
            <SignupPage
              signupName={signupName}
              setSignupName={setSignupName}
              signupEmail={signupEmail}
              setSignupEmail={setSignupEmail}
              signupPassword={signupPassword}
              setSignupPassword={setSignupPassword}
              signupConfirmPassword={signupConfirmPassword}
              setSignupConfirmPassword={setSignupConfirmPassword}
              signupIsSeller={signupIsSeller}
              setSignupIsSeller={setSignupIsSeller}
              signupError={signupError}
              setSignupError={setSignupError}
              isSigningUp={isSigningUp}
              handleSignupSubmit={handleSignupSubmit}
              setLoginError={setLoginError}
              setCurrentPage={setCurrentPage}
            />
          } />

          <Route path="/product/:productId" element={
            <ProductDetailsPageWrapper
              selectedProductForDetails={selectedProductForDetails}
              setSelectedProductForDetails={setSelectedProductForDetails}
              setCurrentPage={setCurrentPage}
              setIsInformationOpen={setIsInformationOpen}
              handleAddToCart={handleAddToCart}
              handleFavoriteToggle={handleFavoriteToggle}
              favoriteItems={favoriteItems}
              authToken={authToken}
              triggerNotification={triggerNotification}
              setAllProductsForFilters={setAllProductsForFilters}
              setProducts={setProducts}
              currentPageNum={currentPageNum}
              selectedCategories={selectedCategories}
              searchQuery={searchQuery}
              currentPage={currentPage}
            />
          } />

          {['collections', 'men', 'women', 'accessories'].map((pathCat) => (
            <Route
              key={pathCat}
              path={`/${pathCat}`}
              element={
                <CatalogPage
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  filteredPageProducts={filteredPageProducts}
                  uniqueCategories={uniqueCategories}
                  selectedCategories={selectedCategories}
                  handleCategoryToggle={handleCategoryToggle}
                  priceRangeMax={priceRangeMax}
                  setPriceRangeMax={setPriceRangeMax}
                  selectedSizes={selectedSizes}
                  handleSizeToggle={handleSizeToggle}
                  uniqueColors={uniqueColors}
                  selectedColors={selectedColors}
                  handleColorToggle={handleColorToggle}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  handleClearAllFilters={handleClearAllFilters}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  isLoadingProducts={isLoadingProducts}
                  productsError={productsError}
                  favoriteItems={favoriteItems}
                  handleFavoriteToggle={handleFavoriteToggle}
                  onProductClick={(p) => {
                    setSelectedProductForDetails(p);
                    navigate(`/product/${p.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onAddToCart={handleAddToCart}
                  currentPageNum={currentPageNum}
                  setCurrentPageNum={setCurrentPageNum}
                  hasMoreProducts={hasMoreProducts}
                />
              }
            />
          ))}

          <Route path="/admin" element={
            authToken && (userProfile.role === 'admin' || userProfile.role === 'seller') ? (
              <AdminPage
                authToken={authToken}
                triggerNotification={triggerNotification}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/ai-shopping" element={<AiShoppingPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminPage && (
        <Footer
          setCurrentPage={setCurrentPage}
          handleScrollToNewArrivals={handleScrollToNewArrivals}
          setIsInformationOpen={setIsInformationOpen}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onAddOrder={handleAddOrder}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteItems={favoriteItems}
        onFavoriteToggle={handleFavoriteToggle}
        onAddToCart={handleAddToCart}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Dynamic size guide modal */}
      {isInformationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white p-8 max-w-md w-full shadow-2xl space-y-6 text-left relative rounded-sm">
            <h3 className="text-xl font-bold uppercase tracking-wider text-black">Technical Specifications</h3>
            <div className="space-y-4 text-xs text-neutral-600 leading-relaxed font-medium uppercase tracking-wider">
              <div className="pb-3 border-b border-neutral-100">
                <p className="font-extrabold text-black mb-1">Standard Shipping</p>
                <p className="text-[10px] text-neutral-400">Complimentary standard shipping for loyalty members. Ships in 3-5 days.</p>
              </div>
              <div className="pb-3 border-b border-neutral-100">
                <p className="font-extrabold text-black mb-1">Return Window</p>
                <p className="text-[10px] text-neutral-400">30-day return policy. Items must be unworn with original tagging.</p>
              </div>
              <div>
                <p className="font-extrabold text-black mb-1">Strap Sizes Guide</p>
                <p className="text-[10px] text-neutral-400">XS: 130mm | S: 150mm | M: 170mm | L: 190mm | XL: 210mm</p>
              </div>
            </div>
            <button
              onClick={() => setIsInformationOpen(false)}
              className="w-full bg-black text-white hover:bg-neutral-900 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              Acknowledged
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Shopping Assistant FAB for all customers */}
      {currentPage !== 'ai-shopping' && (
        <button
          id="floating-ai-assistant-fab"
          onClick={() => {
            setCurrentPage('ai-shopping');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#2F58CD] hover:bg-blue-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Ask AI Shopping Assistant"
        >
          <Sparkles size={18} className="animate-pulse" />
          <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wider">AI Assistant</span>
        </button>
      )}
    </div>
  );
}
