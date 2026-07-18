import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, X } from 'lucide-react';
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
    { label: 'Accessories', page: 'accessories' as const }
  ];

  return (
    <>
      <header id="app-header" className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/50 h-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-6 md:px-16 flex justify-between items-center">
          
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-12">
            <button 
              id="header-logo-btn"
              onClick={() => {
                onPageChange('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="text-2xl md:text-3xl font-black tracking-tighter text-black uppercase cursor-pointer"
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
                        // Allow layout update before scroll
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
          <div className="flex items-center gap-6">
            
            {/* Search Toggle */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search collection..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full text-sm py-1.5 px-3 bg-neutral-100 border border-neutral-200 rounded-sm focus:outline-none focus:border-black transition-colors"
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
                className="text-neutral-700 hover:text-black transition-colors p-1 cursor-pointer"
                title="Search collection"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>

            {/* Favorites Icon */}
            <button
              id="favorites-drawer-btn"
              onClick={onFavoritesToggle}
              className="text-neutral-700 hover:text-black transition-colors p-1 relative cursor-pointer"
              title="Favorites"
            >
              <Heart size={20} />
              {favoritesCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white"
                >
                  {favoritesCount}
                </motion.span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              id="cart-drawer-btn"
              onClick={onCartToggle}
              className="text-neutral-700 hover:text-black transition-colors p-1 relative cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#2F58CD] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white"
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
                className="text-neutral-700 hover:text-black transition-colors p-1 cursor-pointer border border-neutral-200 hover:border-black rounded-full"
                title="Profile & Loyalty"
              >
                <User size={18} />
              </button>
            ) : (
              <div className="flex items-center gap-3.5 pl-2 border-l border-neutral-200">
                <button
                  id="nav-login-btn"
                  onClick={() => onPageChange('login')}
                  className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 cursor-pointer transition-colors"
                >
                  Log In
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onPageChange('signup')}
                  className="bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm cursor-pointer shadow-sm transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Mobile navigation bottom bar */}
      <div id="mobile-nav-indicator" className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-black/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-6 shadow-xl border border-neutral-800">
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
              className={`text-[10px] tracking-widest uppercase font-semibold transition-colors ${
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
