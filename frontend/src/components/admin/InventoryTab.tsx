import React from 'react';
import { Plus, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { Product } from '../../types';

interface InventoryTabProps {
  productsList: Product[];
  isLoadingInventory: boolean;
  onCreateProductClick: () => void;
  onEditProductClick: (product: Product) => void;
  onDeleteProductClick: (id: string) => void;
}

export default function InventoryTab({
  productsList,
  isLoadingInventory,
  onCreateProductClick,
  onEditProductClick,
  onDeleteProductClick
}: InventoryTabProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-black">Product Inventory</h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Manage LuxeMarket products, adjust catalog sizes/pricing structures, and delete records.
          </p>
        </div>
        <button
          onClick={onCreateProductClick}
          className="bg-black hover:bg-neutral-800 text-white px-5 py-3 text-xs font-black uppercase tracking-widest rounded-sm transition-colors cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {isLoadingInventory ? (
        <div className="text-center py-20 bg-white border border-[#E9ECEF] rounded-md">
          <RefreshCw className="animate-spin text-neutral-400 mx-auto mb-2" size={24} />
          <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
            Synchronizing database records...
          </span>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-[#E9ECEF] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-[#E9ECEF] text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  <th className="py-4 px-6">Product details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Gender</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9ECEF]">
                {productsList.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-12 bg-neutral-100 border border-neutral-200 rounded-sm overflow-hidden shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-black block">{product.name}</span>
                          <span className="text-[10px] text-neutral-400 block mt-0.5 font-medium">
                            ID: {product.id} | <span className={typeof product.stock === 'number' && product.stock <= 5 ? "text-red-500 font-extrabold" : "text-neutral-500 font-semibold"}>Stock: {product.stock ?? 0} units</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold uppercase text-neutral-500 tracking-wider">
                      {product.category}
                    </td>
                    <td className="py-4 px-6 font-semibold uppercase text-neutral-500 tracking-wider">
                      {product.gender}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-black">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#2F58CD]">
                      {product.rating} / 5
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEditProductClick(product)}
                          className="p-2 border border-[#CED4DA] hover:border-black text-neutral-600 hover:text-black rounded-sm transition-colors cursor-pointer"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteProductClick(product.id)}
                          className="p-2 border border-red-200 hover:border-red-600 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-sm transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
