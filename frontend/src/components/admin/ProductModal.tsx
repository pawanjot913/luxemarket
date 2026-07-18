import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { Product } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  onSave: (payload: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  onSave,
  isSubmitting
}: ProductModalProps) {
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState<'Outerwear' | 'Footwear' | 'Eyewear' | 'Bags' | 'Accessories'>('Outerwear');
  const [prodGender, setProdGender] = useState<'Men' | 'Women' | 'Unisex'>('Unisex');
  const [prodImage, setProdImage] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodSizes, setProdSizes] = useState('S,M,L,XL');
  const [prodColors, setProdColors] = useState('Charcoal Black:#1C1C1C,Chalk White:#F5F5F7');
  const [prodStock, setProdStock] = useState('10');

  useEffect(() => {
    if (editingProduct) {
      setProdName(editingProduct.name);
      setProdPrice(editingProduct.price.toString());
      setProdCategory(editingProduct.category);
      setProdGender(editingProduct.gender);
      setProdImage(editingProduct.image);
      setProdDescription(editingProduct.description || '');
      setProdSizes(editingProduct.sizes?.join(',') || 'S,M,L,XL');
      setProdColors(editingProduct.colors?.map(c => `${c.name}:${c.hex}`).join(',') || 'Charcoal Black:#1C1C1C');
      setProdStock(editingProduct.stock?.toString() || '0');
    } else {
      setProdName('');
      setProdPrice('');
      setProdCategory('Outerwear');
      setProdGender('Unisex');
      setProdImage('https://lh3.googleusercontent.com/aida-public/AB6AXuDPKxREP9P_FWpSrGLDBZtdR--xSPOEKDgLvdTbxCUj-X0Xffz7ZxUsH_FZJJ9Gu8SgF_CAmrV97WhqafhLTnBwLEiO9fzY8ztLq8f64E9ZqkftsVlLipi44F-OTV_cKJwVJRL3FxU4Il73MJ2KD8KjIzjYMmgqsDkAMEonZXmIXO2Xdka0lX-94N9hAB7fLRvBI_cFgJZrsVgnA-tX0GLJ02QJGN4GYWxq9egHukmQkAXK6TC73TsQcl6VMUI-DlUMKCmpJNxlvdSj');
      setProdDescription('An exquisite masterwork crafted from weather-resistant materials, featuring technical ergonomic panelling.');
      setProdSizes('S,M,L,XL');
      setProdColors('Charcoal Black:#1C1C1C,Chalk White:#F5F5F7');
      setProdStock('10');
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map size array and color structures
    const sizesArr = prodSizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = prodColors.split(',').map(c => {
      const [name, hex] = c.split(':');
      return { name: name?.trim() || 'Default', hex: hex?.trim() || '#000000' };
    }).filter(Boolean);

    const payload = {
      name: prodName,
      price: parseFloat(prodPrice) || 0,
      category: prodCategory,
      gender: prodGender,
      image: prodImage,
      description: prodDescription,
      sizes: sizesArr,
      colors: colorsArr,
      stock: parseInt(prodStock) || 0,
      rating: editingProduct ? editingProduct.rating : 4.5,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      details: editingProduct ? editingProduct.details : ['Crafted in limited quantities.', 'Imported.']
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl p-8 space-y-6 text-left max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-black">
            {editingProduct ? 'Edit Catalog Specifications' : 'Integrate New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black p-1 hover:bg-neutral-100 rounded-full cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Product Name</label>
            <input
              type="text"
              required
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              placeholder="e.g. Classic Trench Coat"
              className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Product Price */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                required
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                placeholder="e.g. 895.00"
                className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black"
              />
            </div>

            {/* Product Stock */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Inventory Stock</label>
              <input
                type="number"
                required
                value={prodStock}
                onChange={(e) => setProdStock(e.target.value)}
                placeholder="e.g. 10"
                className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black"
              />
            </div>

            {/* Product Gender */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Gender Target</label>
              <select
                value={prodGender}
                onChange={(e) => setProdGender(e.target.value as any)}
                className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black bg-white"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Product Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Category</label>
              <select
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value as any)}
                className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black bg-white"
              >
                <option value="Outerwear">Outerwear</option>
                <option value="Footwear">Footwear</option>
                <option value="Eyewear">Eyewear</option>
                <option value="Bags">Bags</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* Sizes List */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Sizes (comma-separated)</label>
              <input
                type="text"
                value={prodSizes}
                onChange={(e) => setProdSizes(e.target.value)}
                placeholder="e.g. S,M,L,XL"
                className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black"
              />
            </div>
          </div>

          {/* Colors string (comma-separated list of Name:Hex) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 tracking-widest">
              Swatches (Comma separated Name:Hex)
            </label>
            <input
              type="text"
              value={prodColors}
              onChange={(e) => setProdColors(e.target.value)}
              placeholder="e.g. Matte Gray:#4A4A4A,Ocean Blue:#1D4ED8"
              className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Image Asset URL</label>
            <input
              type="text"
              required
              value={prodImage}
              onChange={(e) => setProdImage(e.target.value)}
              placeholder="e.g. https://domain.com/image.jpg"
              className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Editorial Description</label>
            <textarea
              value={prodDescription}
              onChange={(e) => setProdDescription(e.target.value)}
              placeholder="Provide luxury specifications..."
              rows={3}
              className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black resize-none"
            />
          </div>

          {/* Form buttons */}
          <div className="pt-4 border-t border-neutral-100 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-[#CED4DA] hover:border-black text-black py-3 rounded-sm font-black uppercase tracking-widest transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black hover:bg-neutral-800 text-white py-3 rounded-sm font-black uppercase tracking-widest transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
            >
              {isSubmitting && <RefreshCw className="animate-spin" size={12} />}
              <span>{editingProduct ? 'Save Specs' : 'Integrate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
