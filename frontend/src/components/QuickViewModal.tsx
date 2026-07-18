import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, RefreshCw, ShoppingBag, Check } from 'lucide-react';
import { Product, Color } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: Color, quantity: number) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart
}: QuickViewModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<Color>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);

  // Reset local state when product changes
  useEffect(() => {
    setSelectedSize(product.sizes ? product.sizes[0] : 'Classic');
    setSelectedColor(product.colors[0]);
    setQuantity(1);
    setAddedSuccessfully(false);
    setIsAdding(false);
  }, [product]);

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product, selectedSize, selectedColor, quantity);
      setIsAdding(false);
      setAddedSuccessfully(true);
      setTimeout(() => {
        setAddedSuccessfully(false);
      }, 2000);
    }, 800);
  };

  return (
    <AnimatePresence>
      <div id="quickview-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          id="quickview-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden my-auto"
        >
          {/* Close Button */}
          <button
            id="close-quickview-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-neutral-400 hover:text-black hover:bg-neutral-100 p-2 rounded-full transition-colors cursor-pointer"
            title="Close modal"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="bg-neutral-50 relative aspect-[4/5] md:aspect-auto md:h-[550px] flex items-center justify-center">
              <img
                id="quickview-product-image"
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <span id="quickview-new-badge" className="absolute top-6 left-6 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                  New Arrival
                </span>
              )}
            </div>

            {/* Details Section */}
            <div className="p-6 md:p-10 flex flex-col justify-between h-full md:max-h-[550px] overflow-y-auto">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between mb-2">
                  <span id="quickview-category" className="text-[10px] text-neutral-400 font-bold tracking-[0.2em] uppercase">
                    {product.category}
                  </span>
                  <div id="quickview-rating" className="flex items-center gap-1">
                    <Star size={14} className="text-black fill-current" />
                    <span className="text-xs font-semibold text-black">{product.rating}</span>
                    <span className="text-xs text-neutral-400">({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Name & Price */}
                <h2 id="quickview-title" className="text-xl md:text-2xl font-black tracking-tight text-black mb-3">
                  {product.name}
                </h2>
                <span id="quickview-price" className="text-lg md:text-xl font-bold text-[#2F58CD]">
                  ${product.price.toFixed(2)}
                </span>

                {/* Description */}
                <p id="quickview-description" className="text-neutral-500 text-xs md:text-sm leading-relaxed mt-4 mb-6">
                  {product.description}
                </p>

                {/* Color Selection */}
                <div className="mb-6">
                  <span id="quickview-color-label" className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-3">
                    Color: <span className="text-black font-semibold normal-case text-xs">{selectedColor.name}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor.name === color.name;
                      return (
                        <button
                          id={`color-chip-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer hover:scale-105 ${
                            isSelected ? 'border-black scale-105 shadow-sm' : 'border-neutral-200'
                          }`}
                          title={color.name}
                        >
                          <span
                            className="w-6 h-6 rounded-full block border border-neutral-200"
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <span id="quickview-size-label" className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-3">
                      Size: <span className="text-black font-semibold uppercase text-xs">{selectedSize}</span>
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {product.sizes.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            id={`size-chip-${size.toLowerCase()}`}
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 text-xs font-semibold tracking-wider rounded-sm transition-all duration-150 cursor-pointer hover:border-black border ${
                              isSelected
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-neutral-700 border-neutral-200'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity and Actions */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-neutral-200 rounded-sm bg-neutral-50">
                    <button
                      id="decrease-qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-sm text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span id="qty-indicator" className="px-3 text-xs font-bold text-black select-none">
                      {quantity}
                    </span>
                    <button
                      id="increase-qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-sm text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    id="add-to-cart-cta"
                    onClick={handleAdd}
                    disabled={isAdding}
                    className={`flex-1 py-3 px-6 text-xs font-bold tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 cursor-pointer ${
                      addedSuccessfully 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-black hover:bg-[#2F58CD] text-white disabled:bg-neutral-400'
                    }`}
                  >
                    {isAdding ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : addedSuccessfully ? (
                      <>
                        <Check size={14} />
                        Added to bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        Add to Shopping Bag
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quality details / Specifications */}
              <div className="border-t border-neutral-100 pt-5 mt-auto">
                <div className="grid grid-cols-2 gap-4 text-[10px] md:text-xs">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <ShieldCheck size={15} className="text-[#2F58CD]" />
                    <span>Free secure shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <RefreshCw size={14} className="text-[#2F58CD]" />
                    <span>30-Day lifetime return</span>
                  </div>
                </div>

                {/* Bullet details expander */}
                <div className="mt-4">
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Specifications:</span>
                  <ul className="list-disc pl-4 text-[11px] text-neutral-500 space-y-1">
                    {product.details.slice(0, 3).map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
