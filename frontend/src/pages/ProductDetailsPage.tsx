import React from 'react';
import { motion } from 'motion/react';
import { Eye, ShoppingBag, Heart } from 'lucide-react';
import { Product, ProductReview, Color } from '../types';

interface ProductDetailsPageProps {
  selectedProductForDetails: Product;
  setCurrentPage: (page: string) => void;
  selectedDetailImage: string;
  setSelectedDetailImage: (img: string) => void;
  reviewsAvgRating: number;
  reviewsCount: number;
  selectedDetailColor: Color | null;
  setSelectedDetailColor: (color: Color | null) => void;
  selectedDetailSize: string;
  setSelectedDetailSize: (size: string) => void;
  setIsInformationOpen: (open: boolean) => void;
  handleAddToCart: (product: Product, size: string, color: Color, quantity: number) => void;
  handleFavoriteToggle: (product: Product) => void;
  favoriteItems: Product[];
  activeDetailTab: 'details' | 'shipping' | 'reviews';
  setActiveDetailTab: (tab: 'details' | 'shipping' | 'reviews') => void;
  reviews: ProductReview[];
  authToken: string | null;
  handleSubmitReview: (e: React.FormEvent) => void;
  submitReviewError: string | null;
  writeRating: number;
  setWriteRating: (rating: number) => void;
  writeComment: string;
  setWriteComment: (comment: string) => void;
  isSubmittingReview: boolean;
}

export default function ProductDetailsPage({
  selectedProductForDetails,
  setCurrentPage,
  selectedDetailImage,
  setSelectedDetailImage,
  reviewsAvgRating,
  reviewsCount,
  selectedDetailColor,
  setSelectedDetailColor,
  selectedDetailSize,
  setSelectedDetailSize,
  setIsInformationOpen,
  handleAddToCart,
  handleFavoriteToggle,
  favoriteItems,
  activeDetailTab,
  setActiveDetailTab,
  reviews,
  authToken,
  handleSubmitReview,
  submitReviewError,
  writeRating,
  setWriteRating,
  writeComment,
  setWriteComment,
  isSubmittingReview
}: ProductDetailsPageProps) {
  return (
    <section className="py-12 max-w-7xl mx-auto px-6 md:px-16 text-left">
      {/* Breadcrumbs */}
      <div className="text-xs text-neutral-400 flex items-center gap-2 mb-8 font-semibold tracking-widest uppercase">
        <button onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-black transition-colors cursor-pointer">Home</button>
        <span>/</span>
        <button onClick={() => { setCurrentPage('collections'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-black transition-colors cursor-pointer">Collections</button>
        <span>/</span>
        <span className="text-neutral-900 font-bold">{selectedProductForDetails.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left Column: Image previews */}
        <div className="flex-1 space-y-6">
          <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden rounded-lg border border-neutral-100 group">
            <img
              src={selectedDetailImage || undefined}
              alt={selectedProductForDetails.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full border border-neutral-200 text-neutral-600">
              <Eye size={18} />
            </div>
          </div>

          {/* Thumbnails row */}
          {selectedProductForDetails.images && selectedProductForDetails.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {selectedProductForDetails.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDetailImage(img)}
                  className={`w-20 h-24 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedDetailImage === img ? 'border-black scale-95 shadow-md' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: details selection */}
        <div className="flex-1 space-y-8">
          <div>
            <span className="text-[10px] text-neutral-400 font-bold tracking-[0.25em] uppercase block mb-2">
              Precision Engineering Series
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight leading-tight mb-4">
              {selectedProductForDetails.name}
            </h1>

            {/* Rating Stars Summary */}
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center text-amber-500 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="leading-none">
                    {i < Math.round(reviewsAvgRating) ? '★' : '☆'}
                  </span>
                ))}
              </span>
              <button
                onClick={() => setActiveDetailTab('reviews')}
                className="text-xs text-neutral-500 hover:text-black font-semibold uppercase tracking-wider underline underline-offset-4 cursor-pointer"
              >
                ({reviewsCount} Reviews)
              </button>
            </div>

            <span className="text-3xl font-black text-neutral-900 block">
              ${selectedProductForDetails.price.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-neutral-100 pt-6 space-y-6">
            {/* Colors selector */}
            {selectedProductForDetails.colors && selectedProductForDetails.colors.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Case Finish: {selectedDetailColor?.name || 'Selected'}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedProductForDetails.colors.map((c) => {
                    const isActive = selectedDetailColor?.name === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedDetailColor(c)}
                        title={c.name}
                        className={`w-9 h-9 rounded-full border relative flex items-center justify-center transition-all cursor-pointer ${
                          isActive ? 'ring-2 ring-black ring-offset-2 scale-110' : 'hover:scale-105 border-neutral-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {c.name.toLowerCase() === 'white' && !isActive && (
                          <span className="w-full h-full rounded-full border border-neutral-200 absolute" />
                        )}
                        {isActive && (
                          <span className={`text-xs font-bold ${
                            ['white', 'off-white', 'yellow'].includes(c.name.toLowerCase()) ? 'text-black' : 'text-white'
                          }`}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes selector */}
            {selectedProductForDetails.sizes && selectedProductForDetails.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center max-w-sm">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    Strap Length
                  </h4>
                  <button
                    onClick={() => setIsInformationOpen(true)}
                    className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-2 hover:text-[#2F58CD] cursor-pointer"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedProductForDetails.sizes.map((s) => {
                    const isActive = selectedDetailSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedDetailSize(s)}
                        className={`px-6 py-3 border text-xs font-bold uppercase tracking-widest transition-all min-w-[80px] text-center cursor-pointer ${
                          isActive
                            ? 'bg-black border-black text-white'
                            : 'border-neutral-200 text-neutral-600 hover:border-black'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Adding Actions */}
          <div className="border-t border-neutral-100 pt-8 space-y-4 max-w-md">
            <button
              onClick={() => {
                handleAddToCart(
                  selectedProductForDetails,
                  selectedDetailSize,
                  selectedDetailColor || selectedProductForDetails.colors[0],
                  1
                );
              }}
              className="w-full bg-black text-white hover:bg-neutral-900 py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] transition-colors rounded-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} />
              Add to Cart
            </button>
            <button
              onClick={() => handleFavoriteToggle(selectedProductForDetails)}
              className="w-full border border-neutral-300 hover:border-black py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <Heart size={14} fill={favoriteItems.some(f => f.id === selectedProductForDetails.id) ? 'currentColor' : 'none'} />
              Add to Wishlist
            </button>
          </div>

          {/* Tabs selection details */}
          <div className="border-t border-neutral-100 pt-8">
            <div className="flex gap-8 border-b border-neutral-100 pb-3 text-xs uppercase font-bold tracking-widest">
              {(['details', 'shipping', 'reviews'] as const).map(tab => {
                const isActive = activeDetailTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveDetailTab(tab)}
                    className={`pb-3 relative transition-colors cursor-pointer ${
                      isActive ? 'text-black font-extrabold' : 'text-neutral-400 hover:text-black'
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <motion.div
                        layoutId="activeDetailTabLine"
                        className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-black"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 text-xs text-neutral-600 leading-relaxed min-h-[160px]">
              {activeDetailTab === 'details' && (
                <div className="space-y-4">
                  <p>{selectedProductForDetails.description}</p>
                  {selectedProductForDetails.details && selectedProductForDetails.details.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1.5 mt-2">
                      {selectedProductForDetails.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeDetailTab === 'shipping' && (
                <div className="space-y-4">
                  <p>Complimentary signature packaging and shipping on all domestic purchases above $500.</p>
                  <p>Standard carrier shipping takes approximately 3-5 business days. Return requests are accepted within 30 days of the delivery confirmation stamp.</p>
                </div>
              )}

              {activeDetailTab === 'reviews' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-black mb-4">
                      Reviews ({reviews.length})
                    </h4>
                    {reviews.length === 0 ? (
                      <p className="text-neutral-400 italic">No reviews written for this product yet.</p>
                    ) : (
                      <div className="divide-y divide-neutral-100 max-h-[300px] overflow-y-auto pr-2">
                        {reviews.map(r => (
                          <div key={r.id} className="py-4 space-y-2 first:pt-0">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-black">
                                {typeof r.user === 'object' ? r.user.name : 'Verified Customer'}
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                {new Date(r.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className="text-xs">
                                  {i < r.rating ? '★' : '☆'}
                                </span>
                              ))}
                            </div>
                            <p className="text-neutral-600">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {authToken ? (
                    <form onSubmit={handleSubmitReview} className="border-t border-neutral-100 pt-6 space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-black">
                        Write a Review
                      </h4>
                      {submitReviewError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">
                          {submitReviewError}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                          Rating: {writeRating} / 5 Stars
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setWriteRating(star)}
                              className="text-2xl text-amber-500 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                            >
                              {star <= writeRating ? '★' : '☆'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                          Review Comment
                        </label>
                        <textarea
                          value={writeComment}
                          onChange={(e) => setWriteComment(e.target.value)}
                          rows={4}
                          placeholder="Share your experience with this precision garment..."
                          className="w-full p-3 border border-neutral-200 text-xs focus:outline-none focus:border-black rounded-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="bg-black hover:bg-neutral-800 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest disabled:opacity-40 cursor-pointer"
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-neutral-50 border border-neutral-200 p-4 rounded text-center">
                      <p className="text-neutral-500">
                        Please log in to your account profile to write a review.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
