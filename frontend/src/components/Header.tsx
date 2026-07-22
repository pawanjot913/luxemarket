import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onCartToggle: () => void;
  onFavoritesToggle: () => void;
  onProfileToggle: () => void;
  cartCount: number;
  favoritesCount: number;
  currentPage: string;
  onPageChange: (page: string) => void;
  onScrollToNewArrivals: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoggedIn?: boolean;
}

export default function Header({
  onCartToggle,
  onFavoritesToggle,
  onProfileToggle,
  cartCount,
  favoritesCount,
  currentPage,
  onPageChange,
  onScrollToNewArrivals,
  searchQuery,
  onSearchChange,
  isLoggedIn = false
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { label: 'New Arrivals', page: 'home' as const, isScroll: true },
    { label: 'Collections', page: 'collections' as const },
    { label: 'Men', page: 'men' as const },
    { label: 'Women', page: 'women' as const },
    { label: 'Accessories', page: 'accessories' as const },
    { label: 'AI Assistant', page: 'ai-shopping' as const, isAi: true }
  ];

  return (
    <>
      <header id="app-header" className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/50 h-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 md:px-16 flex justify-between items-center">
          
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-4 lg:gap-12">
            <button 
              id="header-logo-btn"
              onClick={() => {
                onPageChange('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-black uppercase cursor-pointer shrink-0"
            >
              LuxeMarket
            </button>
            
            <nav id="header-nav" className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = item.isScroll ? false : currentPage === item.page;
                return (
                  <button
                    id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    key={item.label}
                    onClick={() => {
                      if (item.isScroll) {
                        onPageChange('home');
                        setTimeout(() => {
                          onScrollToNewArrivals();
                        }, 50);
                      } else {
                        onPageChange(item.page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`text-sm tracking-wider uppercase font-medium relative py-1 transition-all duration-200 cursor-pointer ${
                      isActive ? 'text-black font-semibold' : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-6">
            
            {/* Search Toggle */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: window.innerWidth < 640 ? 140 : 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-1.5 sm:mr-2"
                  >
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full text-xs sm:text-sm py-1.5 px-2.5 bg-neutral-100 border border-neutral-200 rounded-sm focus:outline-none focus:border-black transition-colors"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                id="search-toggle-btn"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (isSearchOpen) onSearchChange('');
                }}
                className="text-neutral-700 hover:text-black transition-colors p-1 cursor-pointer shrink-0"
                title="Search collection"
              >
                {isSearchOpen ? <X size={18} /> : <Search size={18} />}
              </button>
            </div>

            {/* AI Assistant Pill Button */}
            <button
              id="header-ai-assistant-btn"
              onClick={() => {
                onPageChange('ai-shopping');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden md:flex bg-[#2F58CD] hover:bg-blue-700 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full items-center gap-1 sm:gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              title="AI Shopping Assistant"
            >
              <Sparkles size={12} className="animate-pulse" />
              <span>AI Assistant</span>
            </button>

            {/* Favorites Icon */}
            <button
              id="favorites-drawer-btn"
              onClick={onFavoritesToggle}
              className="text-neutral-700 hover:text-black transition-colors p-1 relative cursor-pointer shrink-0"
              title="Favorites"
            >
              <Heart size={18} />
              {favoritesCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white"
                >
                  {favoritesCount}
                </motion.span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              id="cart-drawer-btn"
              onClick={onCartToggle}
              className="text-neutral-700 hover:text-black transition-colors p-1 relative cursor-pointer shrink-0"
              title="Shopping Bag"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#2F58CD] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Profile/Loyalty Icon or Login/Signup */}
            {isLoggedIn ? (
              <button
                id="profile-drawer-btn"
                onClick={onProfileToggle}
                className="text-neutral-700 hover:text-black transition-colors p-1 cursor-pointer border border-neutral-200 hover:border-black rounded-full shrink-0"
                title="Profile & Loyalty"
              >
                <User size={16} />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-3.5 pl-1.5 sm:pl-2 border-l border-neutral-200 shrink-0">
                <button
                  id="nav-login-btn"
                  onClick={() => onPageChange('login')}
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest hover:text-neutral-500 cursor-pointer transition-colors"
                >
                  Log In
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onPageChange('signup')}
                  className="bg-black text-white hover:bg-neutral-800 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm cursor-pointer shadow-sm transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Mobile navigation bottom bar */}
      <div id="mobile-nav-indicator" className="lg:hidden fixed bottom-5 left-1/2 transform -translate-x-1/2 z-40 bg-black/95 backdrop-blur-md px-4 py-2.5 rounded-full flex items-center gap-3 sm:gap-5 shadow-2xl border border-neutral-800 max-w-[94vw] overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { label: 'Home', page: 'home' as const },
          { label: 'Collections', page: 'collections' as const },
          { label: 'Men', page: 'men' as const },
          { label: 'Women', page: 'women' as const },
          { label: 'Accessories', page: 'accessories' as const }
        ].map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              id={`mobile-nav-${item.page}`}
              key={item.page}
              onClick={() => {
                onPageChange(item.page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase font-semibold transition-colors shrink-0 ${
                isActive ? 'text-white border-b-2 border-white pb-0.5' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
