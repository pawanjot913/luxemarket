import React from 'react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteItems: Product[];
  onFavoriteToggle: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: any, quantity: number) => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favoriteItems,
  onFavoriteToggle,
  onAddToCart
}: FavoritesDrawerProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="fav-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        {/* Click outside to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          id="fav-drawer-container"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 id="fav-drawer-title" className="text-sm font-bold tracking-widest uppercase text-black">
              Favorites ({favoriteItems.length})
            </h2>
            <button
              id="close-fav-btn"
              onClick={onClose}
              className="text-neutral-400 hover:text-black p-1 hover:bg-neutral-100 rounded-full transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6">
            {favoriteItems.length === 0 ? (
              <div id="empty-fav-view" className="h-full flex flex-col items-center justify-center text-center pb-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                  <Heart size={24} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-1">No saved styles</h3>
                <p className="text-xs text-neutral-400 max-w-[240px] leading-relaxed">
                  Save items while exploring to curate your personal style layout.
                </p>
                <button
                  id="empty-fav-shop"
                  onClick={onClose}
                  className="mt-6 border border-black hover:bg-black hover:text-white text-black text-xs font-semibold tracking-widest uppercase py-2.5 px-6 transition-colors duration-200 cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <div id="fav-items-list" className="space-y-6">
                {favoriteItems.map((product) => (
                  <motion.div
                    id={`fav-item-row-${product.id}`}
                    key={product.id}
                    layout
                    className="flex gap-4 border-b border-neutral-100 pb-5"
                  >
                    {/* Image */}
                    <div className="w-16 h-20 bg-neutral-50 rounded-sm overflow-hidden shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-black leading-snug">{product.name}</h4>
                          <button
                            id={`remove-fav-item-${product.id}`}
                            onClick={() => onFavoriteToggle(product)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                            title="Remove from favorites"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-0.5 block">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Quick Add To Bag Action */}
                      <button
                        id={`add-fav-to-cart-${product.id}`}
                        onClick={() => {
                          const size = product.sizes ? product.sizes[0] : 'Classic';
                          const color = product.colors[0];
                          onAddToCart(product, size, color, 1);
                        }}
                        className="mt-2 text-left text-[10px] font-bold text-[#2F58CD] hover:text-black uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag size={11} />
                        Add to shopping bag
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer view */}
          <div className="p-6 border-t border-neutral-100 bg-neutral-50">
            <button
              id="fav-shop-all-btn"
              onClick={onClose}
              className="w-full bg-black hover:bg-neutral-800 text-white py-3 text-xs font-bold tracking-widest uppercase rounded-sm text-center transition-colors cursor-pointer"
            >
              Continue Styling
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
