import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product, Color } from '../types';

interface HomePageProps {
  newArrivalsProducts: Product[];
  isLoadingProducts: boolean;
  productsError: string | null;
  favoriteItems: Product[];
  handleFavoriteToggle: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: Color, quantity: number) => void;
  handleScrollToNewArrivals: () => void;
  setCurrentPage: (page: string) => void;
}

export default function HomePage({
  newArrivalsProducts,
  isLoadingProducts,
  productsError,
  favoriteItems,
  handleFavoriteToggle,
  onProductClick,
  onAddToCart,
  handleScrollToNewArrivals,
  setCurrentPage,
}: HomePageProps) {
  return (
    <>
      {/* Dynamic Hero Section */}
      <section id="hero-banner-section" className="relative w-full h-[80vh] md:h-[921px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop"
            alt="LuxeMarket Luxury Minimalist Editorial Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col justify-center items-start text-white">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-semibold text-xs tracking-[0.25em] uppercase mb-3 text-white/80"
          >
            Pre-Fall 2024
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-6xl font-black tracking-tight max-w-2xl mb-8 leading-[1.05]"
          >
            Precision in Every Detail
          </motion.h1>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={handleScrollToNewArrivals}
            className="bg-black hover:bg-[#2F58CD] text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg"
          >
            Shop the Collection
          </motion.button>
        </div>
      </section>

      {/* Featured Categories (Bento Row matching Mockup) */}
      <section id="bento-categories" className="py-20 max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Category: Men */}
          <div
            id="category-block-men"
            onClick={() => {
              setCurrentPage('men');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600&auto=format&fit=crop"
              alt="Refined Menswear"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-6 left-6 text-white text-left">
              <h3 className="text-xl font-bold tracking-tight">Men</h3>
              <p className="text-[10px] text-white/80 uppercase tracking-widest mt-1.5 font-medium">Explore Essentials</p>
            </div>
          </div>

          {/* Category: Women */}
          <div
            id="category-block-women"
            onClick={() => {
              setCurrentPage('women');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=600&auto=format&fit=crop"
              alt="Elegant Womenswear"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-6 left-6 text-white text-left">
              <h3 className="text-xl font-bold tracking-tight">Women</h3>
              <p className="text-[10px] text-white/80 uppercase tracking-widest mt-1.5 font-medium">Seasonal Icons</p>
            </div>
          </div>

          {/* Category: Accessories */}
          <div
            id="category-block-accessories"
            onClick={() => {
              setCurrentPage('accessories');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600&auto=format&fit=crop"
              alt="Premium Accessories"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-6 left-6 text-white text-left">
              <h3 className="text-xl font-bold tracking-tight">Accessories</h3>
              <p className="text-[10px] text-white/80 uppercase tracking-widest mt-1.5 font-medium">The Final Touch</p>
            </div>
          </div>

        </div>
      </section>

      {/* Promotional Dark Banner Band */}
      <section id="promo-banner-band" className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left max-w-xl">
            <span className="text-[#2F58CD] font-bold text-[10px] tracking-widest uppercase mb-2 block">Specially Engineered</span>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-3">Newly Engineered</h2>
            <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
              Our latest arrival represents the pinnacle of performance and aesthetics. Discover the future of high-contrast styling and timeless aesthetic restraint.
            </p>
          </div>
          
          <div className="flex gap-4 shrink-0 w-full md:w-auto">
            <button
              id="promo-view-all-btn"
              onClick={() => {
                setCurrentPage('collections');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 md:flex-initial bg-white text-black hover:bg-neutral-100 px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
            >
              View All
            </button>
            <button
              id="promo-learn-more-btn"
              onClick={handleScrollToNewArrivals}
              className="flex-1 md:flex-initial border border-neutral-600 hover:border-white text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Dedicated New Arrivals section at the bottom */}
      <section id="new-arrivals-section" className="py-24 max-w-7xl mx-auto px-6 md:px-16 scroll-mt-24">
        <div className="mb-12 pb-6 border-b border-neutral-100 text-left">
          <span className="text-[10px] text-neutral-400 font-bold tracking-[0.2em] uppercase block mb-1">Latest Release</span>
          <h2 className="text-2xl md:text-3xl font-black text-black">New Arrivals</h2>
        </div>

        {isLoadingProducts ? (
          <div className="text-center py-20">
            <RefreshCw className="animate-spin mx-auto text-neutral-400 mb-4" size={32} />
            <p className="text-xs text-neutral-500 font-medium">Retrieving technical data catalog...</p>
          </div>
        ) : productsError ? (
          <div className="text-center py-20 text-red-500 font-medium text-xs">
            {productsError}
          </div>
        ) : newArrivalsProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 border border-neutral-200 border-dashed rounded-md">
            <p className="text-sm font-semibold text-neutral-500">No new arrivals found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {newArrivalsProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favoriteItems.some((item) => item.id === product.id)}
                onFavoriteToggle={handleFavoriteToggle}
                onQuickView={onProductClick}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
