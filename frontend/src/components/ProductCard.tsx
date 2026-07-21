import React from 'react';
import { Heart, Eye, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product, Color } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  isFavorite: boolean;
  onFavoriteToggle: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart?: (product: Product, size: string, color: Color, quantity: number) => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onFavoriteToggle,
  onQuickView,
  onAddToCart
}: ProductCardProps) {
  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.215, 0.610, 0.355, 1.000] }}
      className="group relative flex flex-col justify-between h-full bg-white border border-neutral-100 rounded-lg p-3 hover:shadow-xl hover:border-neutral-200/80 transition-all duration-300"
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden rounded-md mb-4">
        <img
          id={`product-image-${product.id}`}
          src={product.image || undefined}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span id={`badge-new-${product.id}`} className="bg-black text-white text-[8px] font-black tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-sm">
              New
            </span>
          )}
          {product.price > 1000 && (
            <span id={`badge-exclusive-${product.id}`} className="bg-[#2F58CD] text-white text-[8px] font-black tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-sm">
              Exclusive
            </span>
          )}
        </div>

        {/* Floating Actions (Favorites) */}
        <div className="absolute top-3 right-3 z-10">
          <button
            id={`btn-fav-toggle-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(product);
            }}
            className={`w-8.5 h-8.5 rounded-full flex items-center justify-center border shadow-sm backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
              isFavorite 
                ? 'bg-black border-black text-white' 
                : 'bg-white/90 text-neutral-800 border-neutral-200 hover:bg-white hover:text-black'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Hover Quick Action Buttons Panel (Desktop only) */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden md:flex flex-col gap-2">
          <button
            id={`btn-add-to-bag-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToCart) {
                onAddToCart(
                  product,
                  product.sizes?.[0] || 'S',
                  product.colors?.[0] || { name: 'Default', hex: '#000000' },
                  1
                );
              }
            }}
            className="w-full bg-black text-white hover:bg-neutral-900 py-2.5 px-4 text-[10px] font-bold tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200 cursor-pointer"
          >
            <ShoppingBag size={12} />
            Add to Bag
          </button>
          <button
            id={`btn-quickview-hover-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-white/95 hover:bg-white text-black py-2.5 px-4 text-[10px] font-bold tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200 cursor-pointer border border-neutral-200"
          >
            <Eye size={12} />
            Quick View
          </button>
        </div>
      </div>

      {/* Meta details */}
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col text-left mb-3">
          <span id={`product-cat-${product.id}`} className="text-[9px] text-neutral-400 font-bold tracking-[0.2em] uppercase mb-1">
            {product.category}
          </span>
          <div className="flex justify-between items-start gap-3">
            <h4 id={`product-name-${product.id}`} className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-[#2F58CD] transition-colors line-clamp-2">
              {product.name}
            </h4>
            <span id={`product-price-${product.id}`} className="text-sm font-bold text-black shrink-0">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Mobile action buttons (Mobile only) */}
        <div className="md:hidden flex gap-2 w-full mt-3">
          <button
            id={`btn-add-to-bag-mobile-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToCart) {
                onAddToCart(
                  product,
                  product.sizes?.[0] || 'S',
                  product.colors?.[0] || { name: 'Default', hex: '#000000' },
                  1
                );
              }
            }}
            className="flex-1 bg-black text-white py-2.5 px-3 text-[10px] font-bold tracking-widest uppercase rounded-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <ShoppingBag size={12} className="shrink-0" />
            <span>Add to Bag</span>
          </button>
          <button
            id={`btn-quickview-mobile-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 border border-neutral-300 text-neutral-800 bg-white py-2.5 px-3 text-[10px] font-bold tracking-widest uppercase rounded-sm flex items-center justify-center gap-1.5 cursor-pointer hover:border-black active:scale-95 transition-all"
          >
            <Eye size={12} className="shrink-0" />
            <span>Quick View</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
