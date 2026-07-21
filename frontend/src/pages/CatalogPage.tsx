import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product, Color } from '../types';

interface CatalogPageProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  filteredPageProducts: Product[];
  uniqueCategories: string[];
  selectedCategories: string[];
  handleCategoryToggle: (cat: string) => void;
  priceRangeMax: number;
  setPriceRangeMax: (val: number) => void;
  selectedSizes: string[];
  handleSizeToggle: (size: string) => void;
  uniqueColors: { name: string; hex: string }[];
  selectedColors: string[];
  handleColorToggle: (colorName: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  handleClearAllFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isLoadingProducts: boolean;
  productsError: string | null;
  favoriteItems: Product[];
  handleFavoriteToggle: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: Color, quantity: number) => void;
  currentPageNum: number;
  setCurrentPageNum: React.Dispatch<React.SetStateAction<number>>;
  hasMoreProducts: boolean;
}

export default function CatalogPage({
  currentPage,
  setCurrentPage,
  filteredPageProducts,
  uniqueCategories,
  selectedCategories,
  handleCategoryToggle,
  priceRangeMax,
  setPriceRangeMax,
  selectedSizes,
  handleSizeToggle,
  uniqueColors,
  selectedColors,
  handleColorToggle,
  minRating,
  setMinRating,
  handleClearAllFilters,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  isLoadingProducts,
  productsError,
  favoriteItems,
  handleFavoriteToggle,
  onProductClick,
  onAddToCart,
  currentPageNum,
  setCurrentPageNum,
  hasMoreProducts
}: CatalogPageProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
      
      {/* Page Header */}
      <div className="text-left mb-6 sm:mb-8">
        <div className="text-xs text-neutral-400 flex items-center gap-2 mb-2 font-medium tracking-wider uppercase">
          <button onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-black cursor-pointer">Home</button>
          <span>/</span>
          <span className="text-black font-semibold uppercase">{currentPage}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight">
          {currentPage === 'collections' && 'All Collections'}
          {currentPage === 'men' && "Men's Collection"}
          {currentPage === 'women' && "Women's Collection"}
          {currentPage === 'accessories' && 'Premium Accessories'}
        </h1>
        <p className="text-xs text-neutral-400 mt-2 font-medium">
          Showing {filteredPageProducts.length} precision-engineered pieces
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex justify-between items-center bg-neutral-50 p-4 rounded-md border border-neutral-200">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black cursor-pointer"
          >
            <SlidersHorizontal size={16} />
            <span>Filter Parameters</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={handleClearAllFilters}
            className="text-neutral-400 hover:text-black text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>

        {/* Filter Area (Left Column) */}
        <aside className={`w-full lg:w-64 shrink-0 text-left space-y-8 pr-0 lg:pr-6 lg:border-r lg:border-neutral-100 ${
          isMobileFiltersOpen ? 'block bg-white p-6 rounded-md border border-neutral-200 shadow-sm' : 'hidden lg:block'
        }`}>
          <div className="hidden lg:flex justify-between items-center pb-4 border-b border-neutral-100">
            <h3 className="font-bold text-lg text-black uppercase tracking-wider">Filters</h3>
            <button
              onClick={handleClearAllFilters}
              className="text-neutral-400 hover:text-black text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Categories checklist */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-widest text-neutral-400">Categories</h4>
            <div className="space-y-2">
              {uniqueCategories.map(cat => {
                const isChecked = selectedCategories.includes(cat);
                return (
                  <label key={cat} className="flex items-center gap-3 text-sm text-neutral-600 hover:text-black cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(cat)}
                      className="accent-black w-4 h-4 cursor-pointer"
                    />
                    <span>{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-widest text-neutral-400">Price Range</h4>
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={1500}
                value={priceRangeMax}
                onChange={(e) => setPriceRangeMax(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-xs text-neutral-500 font-medium">
                <span>$0</span>
                <span className="text-black font-semibold">${priceRangeMax} Max</span>
                <span>$1,500+</span>
              </div>
            </div>
          </div>

          {/* Sizes Selector */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-widest text-neutral-400">Size</h4>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => {
                const isActive = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`w-10 h-10 text-xs font-bold border flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-black border-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors Selector */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-widest text-neutral-400">Color</h4>
            <div className="flex flex-wrap gap-2.5">
              {uniqueColors.map(color => {
                const isActive = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => handleColorToggle(color.name)}
                    title={color.name}
                    className={`w-7 h-7 rounded-full border relative flex items-center justify-center transition-all cursor-pointer ${
                      isActive ? 'ring-2 ring-black ring-offset-2 scale-110' : 'hover:scale-105 border-neutral-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {color.name.toLowerCase() === 'white' && !isActive && (
                      <span className="w-full h-full rounded-full border border-neutral-200 absolute" />
                    )}
                    {isActive && (
                      <span className={`text-[10px] font-bold ${
                        ['white', 'off-white', 'yellow'].includes(color.name.toLowerCase()) ? 'text-black' : 'text-white'
                      }`}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-widest text-neutral-400">Rating</h4>
            <div className="space-y-2">
              {[4, 3, 2].map(stars => {
                const isActive = minRating === stars;
                return (
                  <button
                    key={stars}
                    onClick={() => setMinRating(isActive ? 0 : stars)}
                    className={`w-full text-left py-1 px-2 text-sm rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-neutral-100 text-black font-semibold'
                        : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                    }`}
                  >
                    <span className="flex items-center text-amber-500">
                      {Array.from({ length: stars }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                      {Array.from({ length: 5 - stars }).map((_, i) => (
                        <span key={i} className="text-neutral-200">★</span>
                      ))}
                    </span>
                    <span>&amp; Up</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid Catalog (Right Column) */}
        <div className="flex-1">
          
          {/* Toolbar: Active filters and sorting */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-100 text-xs">
            
            {/* Active filter tags */}
            <div className="flex flex-wrap gap-2 text-left">
              {selectedCategories.map(cat => (
                <span key={cat} className="bg-neutral-100 text-black px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1.5 border border-neutral-200">
                  Category: {cat}
                  <button onClick={() => handleCategoryToggle(cat)} className="hover:text-[#2F58CD] font-bold cursor-pointer">✕</button>
                </span>
              ))}
              {priceRangeMax < 1500 && (
                <span className="bg-neutral-100 text-black px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1.5 border border-neutral-200">
                  Max Price: ${priceRangeMax}
                  <button onClick={() => setPriceRangeMax(1500)} className="hover:text-[#2F58CD] font-bold cursor-pointer">✕</button>
                </span>
              )}
              {selectedSizes.map(size => (
                <span key={size} className="bg-neutral-100 text-black px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1.5 border border-neutral-200">
                  Size: {size}
                  <button onClick={() => handleSizeToggle(size)} className="hover:text-[#2F58CD] font-bold cursor-pointer">✕</button>
                </span>
              ))}
              {selectedColors.map(color => (
                <span key={color} className="bg-neutral-100 text-black px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1.5 border border-neutral-200">
                  Color: {color}
                  <button onClick={() => handleColorToggle(color)} className="hover:text-[#2F58CD] font-bold cursor-pointer">✕</button>
                </span>
              ))}
              {minRating > 0 && (
                <span className="bg-neutral-100 text-black px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1.5 border border-neutral-200">
                  Rating: {minRating}★ &amp; up
                  <button onClick={() => setMinRating(0)} className="hover:text-[#2F58CD] font-bold cursor-pointer">✕</button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-neutral-100 text-black px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1.5 border border-neutral-200">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-[#2F58CD] font-bold cursor-pointer">✕</button>
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <span className="text-neutral-400 uppercase tracking-widest text-[10px] font-bold">Sort By</span>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 text-xs px-3 py-1.5 rounded-sm focus:outline-none focus:border-black cursor-pointer font-medium"
              >
                <option value="best-match">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid content */}
          {isLoadingProducts ? (
            <div className="text-center py-20">
              <RefreshCw className="animate-spin mx-auto text-neutral-400 mb-4" size={32} />
              <p className="text-xs text-neutral-500 font-medium">Retrieving technical data catalog...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-20 text-red-500 font-medium text-xs">
              {productsError}
            </div>
          ) : filteredPageProducts.length === 0 ? (
            <div id="no-products-view" className="text-center py-20 bg-neutral-50 border border-neutral-200 border-dashed rounded-md">
              <p className="text-sm font-semibold text-neutral-500">No technical garments match your specified filter parameters.</p>
              <button
                id="reset-catalog-btn"
                onClick={handleClearAllFilters}
                className="mt-4 bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 cursor-pointer hover:bg-[#2F58CD] transition-colors"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <>
              <div id="products-grid-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                <AnimatePresence mode="popLayout">
                  {filteredPageProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favoriteItems.some((item) => item.id === product.id)}
                      onFavoriteToggle={handleFavoriteToggle}
                      onQuickView={onProductClick}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-6 mt-16 pt-6 border-t border-neutral-100">
                <button
                  onClick={() => {
                    if (currentPageNum > 1) {
                      setCurrentPageNum(prev => prev - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={currentPageNum === 1}
                  className="px-4 py-2 border border-neutral-200 text-xs font-bold uppercase tracking-widest hover:border-black disabled:opacity-40 disabled:hover:border-neutral-200 transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Page {currentPageNum}
                </span>
                <button
                  onClick={() => {
                    if (hasMoreProducts) {
                      setCurrentPageNum(prev => prev + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={!hasMoreProducts}
                  className="px-4 py-2 border border-neutral-200 text-xs font-bold uppercase tracking-widest hover:border-black disabled:opacity-40 disabled:hover:border-neutral-200 transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
}
